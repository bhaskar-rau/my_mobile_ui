import { useState, useCallback } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

export const SigninForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    userPassword: "",
  });

  const [errors, setErrors] = useState({
    userId: null,
    userPassword: null,
    serverError: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const validate = useCallback(() => {
    let tempErrors = {
      userId: null,
      userPassword: null,
      serverError: null,
    };
    let isValid = true;

    // Enhanced validation
    if (!formData.userId.trim()) {
      tempErrors.userId = "Username is required";
      isValid = false;
    } else if (formData.userId.length < 3) {
      tempErrors.userId = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(formData.userId)) {
      tempErrors.userId = "Username must contain both letters and numbers";
      isValid = false;
    }

    if (!formData.userPassword.trim()) {
      tempErrors.userPassword = "Password is required";
      isValid = false;
    } else if (formData.userPassword.length < 6) {
      tempErrors.userPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  }, [formData]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: null,
      serverError: null,
    }));
  }, []);

  const handleUserIdChange = useCallback((e) => {
    const value = e.target.value
      .replace(/[^A-Z0-9]/gi, "")
      .toUpperCase();

    setFormData((prev) => ({
      ...prev,
      userId: value,
    }));

    setErrors((prev) => ({
      ...prev,
      userId: null,
      serverError: null,
    }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (isBlocked) {
      setNotification({
        open: true,
        message: 'Too many failed attempts. Please wait before trying again.',
        severity: 'error'
      });
      return;
    }

    if (!validate()) {
      setNotification({
        open: true,
        message: 'Please fix the errors before submitting',
        severity: 'warning'
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        userId: formData.userId.trim(),
        userPassword: formData.userPassword.trim(),
      };

      const response = await apiClient.post("/user/login", requestData);

      const { user, token, refreshToken, expiresIn } = response.data;

      // Reset login attempts on success
      setLoginAttempts(0);
      setIsBlocked(false);

      setNotification({
        open: true,
        message: `Welcome back! Redirecting to ${user.userRole === "VENDOR" ? "vendor" : "customer"} dashboard...`,
        severity: 'success'
      });

      // Store refresh token if provided
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      login(user, token, expiresIn ? expiresIn * 1000 : undefined);

      // Delay navigation to show success message
      setTimeout(() => {
        if (user.userRole === "VENDOR") {
          navigate("/vendor/products");
        } else {
          navigate("/customer/products");
        }
      }, 1500);

    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Block after 5 failed attempts
      if (newAttempts >= 5) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false);
          setLoginAttempts(0);
        }, 300000); // 5 minutes block

        setNotification({
          open: true,
          message: 'Too many failed attempts. Account temporarily blocked for 5 minutes.',
          severity: 'error'
        });
        return;
      }

      if (error.code === 'ECONNABORTED') {
        setNotification({
          open: true,
          message: 'Request timeout. Please check your connection and try again.',
          severity: 'error'
        });
      } else if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401) {
          setNotification({
            open: true,
            message: `Invalid credentials. ${5 - newAttempts} attempts remaining.`,
            severity: 'error'
          });
          setErrors((prev) => ({
            ...prev,
            serverError: "Invalid username or password",
          }));
        } else if (status === 429) {
          setNotification({
            open: true,
            message: 'Too many requests. Please wait before trying again.',
            severity: 'warning'
          });
        } else if (errorData) {
          setErrors((prev) => ({
            ...prev,
            ...errorData,
            serverError: null,
          }));
          setNotification({
            open: true,
            message: 'Login failed. Please check your credentials.',
            severity: 'error'
          });
        }
      } else if (error.request) {
        setNotification({
          open: true,
          message: 'Network error. Please check your internet connection.',
          severity: 'error'
        });
        setErrors((prev) => ({
          ...prev,
          serverError: "Unable to connect to server. Please try again.",
        }));
      } else {
        setNotification({
          open: true,
          message: 'An unexpected error occurred. Please try again.',
          severity: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, validate, isBlocked, loginAttempts, login, navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: "center",
            mb: 4,
            fontFamily: "monospace",
            letterSpacing: "-1px",
          }}
        >
          Login into MyMobile
        </Typography>

        {errors.serverError && (
          <Typography
            color="error"
            sx={{
              textAlign: "center",
              mb: 2,
              fontFamily: "monospace",
            }}
          >
            {errors.serverError}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Customer/Vendor ID"
            variant="outlined"
            name="userId"
            value={formData.userId}
            onChange={handleUserIdChange}
            error={Boolean(errors.userId)}
            helperText={errors.userId || "Enter your unique ID (letters and numbers only)"}
            margin="normal"
            disabled={isLoading || isBlocked}
            autoComplete="username"
            slotProps={{
              input: {
                sx: {
                  fontFamily: "monospace",
                  "&:focus": {
                    borderColor: "black",
                  },
                },
              },
              inputLabel: {
                sx: { fontFamily: "monospace" },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
                "&.Mui-disabled": {
                  backgroundColor: "grey.50",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            error={Boolean(errors.userPassword)}
            helperText={errors.userPassword || "Minimum 6 characters required"}
            margin="normal"
            disabled={isLoading || isBlocked}
            autoComplete="current-password"
            slotProps={{
              input: {
                sx: {
                  fontFamily: "monospace",
                  "&:focus": {
                    borderColor: "black",
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading || isBlocked}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              inputLabel: {
                sx: { fontFamily: "monospace" },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
                "&.Mui-disabled": {
                  backgroundColor: "grey.50",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />

          {loginAttempts > 0 && loginAttempts < 5 && (
            <Typography
              variant="caption"
              color="warning.main"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                fontFamily: "monospace",
              }}
            >
              {5 - loginAttempts} attempts remaining
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading || isBlocked}
            sx={{
              mt: 3,
              backgroundColor: isBlocked ? "grey.400" : "black",
              fontFamily: "monospace",
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                backgroundColor: isBlocked ? "grey.400" : "white",
                color: isBlocked ? "white" : "black",
                border: "1px solid black",
              },
              "&:disabled": {
                backgroundColor: "grey.400",
                color: "white",
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : isBlocked ? (
              "Account Blocked"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ fontFamily: "monospace" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
