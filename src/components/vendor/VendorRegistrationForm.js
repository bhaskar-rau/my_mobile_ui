import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

import RegistrationSuccess from "../common/RegistrationSuccess";
import axios from "axios";

const VendorRegistrationForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userPassword: "",
    userConfirmPassword: "",
    userEmail: "",
    userPanNumber: "",
    userAddress: "",
    userGstNumber: "",
    userNumber: "",
    userRole: "VENDOR",
    countryCode: "",
  });

  const [errors, setErrors] = useState({
    userId: null,
    userName: null,
    userPassword: null,
    userConfirmPassword: null,
    userEmail: null,
    userPanNumber: null,
    userAddress: null,
    userGstNumber: null,
    userNumber: null,
    countryCode: null,
    serverError: null,
  });

  const validate = () => {
    let tempErrors = {
      userId: null,
      userName: null,
      userPassword: null,
      userConfirmPassword: null,
      userEmail: null,
      userPanNumber: null,
      userAddress: null,
      userGstNumber: null,
      userNumber: null,
      countryCode: "",
      serverError: null,
    };
    let isValid = true;

    if (!formData.userId) {
      tempErrors.userId = "Vendor ID is required";
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/.test(formData.userId)) {
      tempErrors.userId = "Vendor ID must contain both letters and numbers";
      isValid = false;
    }

    if (!formData.userName) {
      tempErrors.userName = "Vendor Name is required";
      isValid = false;
    }

    if (!formData.userPassword) {
      tempErrors.userPassword = "Password is required";
      isValid = false;
    } else if (
      !/^(?=.*[0-9])(?=.*[@#%$&])[a-zA-Z0-9@#%$&]{8,15}$/.test(
        formData.userPassword
      )
    ) {
      tempErrors.userPassword =
        "Password must be alphanumeric and contain at least one special character (@, #, %, $, &) and one digit";
      isValid = false;
    }

    if (!formData.userConfirmPassword) {
      tempErrors.userConfirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.userPassword !== formData.userConfirmPassword) {
      tempErrors.userConfirmPassword = "Passwords do not match";
      isValid = false;
    } else if (
      !/^(?=.*[0-9])(?=.*[@#%$&])[a-zA-Z0-9@#%$&]{8,15}$/.test(
        formData.userConfirmPassword
      )
    ) {
      tempErrors.userConfirmPassword =
        "Password must be alphanumeric and contain at least one special character (@, #, %, $, &) and one digit";
      isValid = false;
    }

    if (!formData.userEmail) {
      tempErrors.userEmail = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      tempErrors.userEmail = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.userPanNumber) {
      tempErrors.userPanNumber = "PAN Number is required";
      isValid = false;
    } else if (
      !/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/.test(formData.userPanNumber)
    ) {
      tempErrors.userPanNumber =
        "PAN Number must contain both letters and numbers";
      isValid = false;
    }

    if (!formData.userAddress) {
      tempErrors.userAddress = "Address is required";
      isValid = false;
    } else if (formData.userAddress.length < 30) {
      tempErrors.userAddress = "Address must be at least 30 characters long";
      isValid = false;
    }

    if (!formData.userGstNumber) {
      tempErrors.userGstNumber = "GSTIN  is required";
      isValid = false;
    } else if (
      !/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/.test(formData.userGstNumber)
    ) {
      tempErrors.userGstNumber =
        "Vendor ID must contain both letters and numbers";
      isValid = false;
    }

    if (!formData.countryCode) {
      tempErrors.countryCode = "Country code is required";
      isValid = false;
    }

    if (!formData.userNumber) {
      tempErrors.userNumber = "Mobile number is required";
      isValid = false;
    } else if (formData.userNumber.length !== 10) {
      tempErrors.userNumber = "Mobile number must be 10 digits";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
      serverError: null,
    }));

    console.log("Form Data Object", formData);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const userRequest = {
          userId: formData.userId,
          userName: formData.userName,
          userPassword: formData.userPassword,
          userConfirmPassword: formData.userConfirmPassword,
          userAddress: formData.userAddress,
          userRole: formData.userRole,
          userEmail: formData.userEmail,
          userNumber: formData.userNumber,
          userPincode: 0,
          userPanNumber: formData.userPanNumber,
          userGstNumber: formData.userGstNumber,
        };

        const response = await axios({
          method: "post",
          url: "http://192.168.0.124:9998/register/",
          data: userRequest,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data) {
          console.log("Registration successful:", response.data);
          setShowSuccess(true);
        }
      } catch (error) {
        console.error("Registration error:", error);

        if (error.response && error.response.data) {
          const errorData = error.response.data;
          console.log("Error data:", errorData);

          const newErrors = {};

          // Map each field error from the response
          Object.keys(errorData).forEach((field) => {
            newErrors[field] = errorData[field];
          });

          setErrors((prev) => ({
            ...prev,
            ...newErrors,
            serverError: null,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            serverError: "Network error. Please try again.",
          }));
        }
      }
    }
  };

  if (showSuccess) {
    return <RegistrationSuccess email={formData.userEmail} />;
  }

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mt: 8,
        overflowY: "auto",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          py: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            px: 1,
            pt: 4, // Added top padding
            minHeight: "min-content",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            className="typewriter-black"
            sx={{
              textAlign: "center",
              mb: 3,
              fontFamily: "monospace",
              letterSpacing: "-1px",
            }}
          >
            Register as Vendor
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Vendor ID"
                  size="small"
                  name="userId"
                  value={formData.userId}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Z0-9]/gi, "")
                      .toUpperCase();
                    if (value.length <= 10) {
                      setFormData((prev) => ({
                        ...prev,
                        userId: value,
                      }));
                      setErrors((prev) => ({
                        ...prev,

                        userId: null,
                      }));
                    }
                  }}
                  error={Boolean(errors.userId)}
                  helperText={errors.userId}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Vendor Name"
                  size="small"
                  name="userName"
                  onChange={handleChange}
                  value={formData.userName}
                  error={Boolean(errors.userName)}
                  helperText={errors.userName}
                  onKeyPress={(e) => {
                    if (!/[A-Za-z\s]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  size="small"
                  name="userPassword"
                  onChange={handleChange}
                  value={formData.userPassword}
                  error={Boolean(errors.userPassword)}
                  helperText={errors.userPassword}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  size="small"
                  name="userConfirmPassword"
                  onChange={handleChange}
                  value={formData.userConfirmPassword}
                  error={Boolean(errors.userConfirmPassword)}
                  helperText={errors.userConfirmPassword}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email ID"
                  size="small"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  error={Boolean(errors.userEmail)}
                  helperText={errors.userEmail}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  size="small"
                  name="userPanNumber"
                  value={formData.userPanNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Z0-9]/gi, "")
                      .toUpperCase();
                    if (value.length <= 10) {
                      setFormData((prev) => ({
                        ...prev,
                        userPanNumber: value,
                      }));
                      setErrors((prev) => ({
                        ...prev,

                        userPanNumber: null,
                      }));
                    }
                  }}
                  error={Boolean(errors.userPanNumber)}
                  helperText={errors.userPanNumber}
                  inputProps={{
                    maxLength: 10,
                    style: { textTransform: "uppercase" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  size="small"
                  name="userAddress"
                  value={formData.userAddress}
                  onChange={handleChange}
                  error={Boolean(errors.userAddress)}
                  helperText={errors.userAddress}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="GSTIN"
                  size="small"
                  name="userGstNumber"
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Z0-9]/gi, "")
                      .toUpperCase();
                    if (value.length <= 15) {
                      setFormData((prev) => ({
                        ...prev,
                        userGstNumber: value,
                      }));
                      setErrors((prev) => ({
                        ...prev,

                        userGstNumber: null,
                      }));
                    }
                  }}
                  value={formData.userGstNumber}
                  error={Boolean(errors.userGstNumber)}
                  helperText={errors.userGstNumber}
                  inputProps={{
                    maxLength: 15,
                    style: { textTransform: "uppercase" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "black",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    label="Code"
                    size="small"
                    name="countryCode"
                    value={formData.countryCode}
                    error={Boolean(errors.countryCode)}
                    helperText={errors.countryCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      if (value.length <= 4) {
                        setFormData((prev) => ({
                          ...prev,
                          countryCode: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,

                          countryCode: null,
                        }));
                      }
                    }}
                    InputProps={{
                      startAdornment: <span>+</span>,
                    }}
                    sx={{
                      width: "100px",
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "black",
                      },
                    }}
                  />
                  <TextField
                    label="Mobile Number"
                    size="small"
                    name="userNumber"
                    value={formData.userNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "");
                      if (value.length <= 10) {
                        setFormData((prev) => ({
                          ...prev,
                          userNumber: value,
                        }));
                        setErrors((prev) => ({
                          ...prev,

                          userNumber: null,
                        }));
                      }
                    }}
                    error={Boolean(errors.userNumber)}
                    helperText={errors.userNumber}
                    inputProps={{
                      maxLength: 10,
                    }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "black",
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 2,
                    backgroundColor: "black",
                    fontFamily: "monospace",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid black",
                    },
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorRegistrationForm;
