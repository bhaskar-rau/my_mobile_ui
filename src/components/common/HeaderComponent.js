import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useAuth } from "../../components/common/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const formattedLoginTime = user?.lastLoginTime
    ? new Date(user.lastLoginTime).toLocaleString()
    : null;

  const handleLogout = async () => {
    try {
      if (!user?.userId) {
        console.error("No user ID found");
        logout();
        navigate("/login");
        return;
      }

      // Call logout endpoint
      await apiClient.put(`/logout/${user.userId}`);
      
      // Clear refresh token
      localStorage.removeItem('refreshToken');
      
      console.log("Logout successful");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      logout();
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "black",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={require("../../assets/mobile-logo-icon-only.png")}
              alt="My Mobile Logo"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "monospace",
              color: "white",
              letterSpacing: "-0.5px",
              fontSize: "1.2rem",
            }}
          >
            My Mobile
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user?.userId && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "4px 8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  color: "white",
                  fontSize: "0.9rem",
                }}
              >
                {"Logged In As: " + user.userName}
              </Typography>

              {formattedLoginTime && (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  {" | Last Logged in at: " + formattedLoginTime}
                </Typography>
              )}
            </Box>
          )}
          <Button
            variant="outlined"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
            sx={{
              fontFamily: "monospace",
              color: "white",
              borderColor: "white",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;