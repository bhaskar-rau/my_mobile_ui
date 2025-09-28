import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useAuth } from "../../components/common/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const formattedLoginTime = userData?.lastLoginTime
  ? new Date(userData.lastLoginTime).toLocaleString()
  : null;

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.userId) {
        console.error("No user ID found");
        logout();
        navigate("/login");
        return;
      }

      const response = await axios({
        method: "put",
        url: `http://192.168.0.124:9998/logout/${userData.userId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Logout successful:", response.data);
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
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
          {userData?.userId && (
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
                {"Logged In As: " + userData.userName}
              </Typography>

              {formattedLoginTime && (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    color: "white",
                    fontSize: "0.9rem",
                  //  fontStyle: "italic",
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