import React from "react";
import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Fade,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { SigninForm } from "../components/common/SigninForm";
import VendorRegistrationForm from "../components/vendor/VendorRegistrationForm";
import CustomerRegistrationForm from "../components/customer/CustomerRegistrationForm";

const StyledMenuItem = styled(MenuItem)({
  fontFamily: "monospace",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
});

const SignInPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [form, setForm] = useState("signin");

  const handleRegisterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBackClick = () => {
    setForm("signin");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVendorClick = () => {
    console.log("Vendor registration");
    setForm("vendorform");
    handleClose();
  };

  const handleCustomerClick = () => {
    console.log("Customer registration");
    setForm("customerform");
    handleClose();
  };
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          flex: 1,
          bgcolor: "black",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            mb: 4,
            width: "200px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={require("../assets/mobile-logo-icon-only.png")}
            alt="My Mobile Logo"
            style={{
              width: "200px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: "80%",
            overflow: "hidden",
          }}
        >
          <Fade
            in={true}
            timeout={{
              appear: 1000,
              enter: 1500,
              exit: 500,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "white",
                fontFamily: "monospace",
                textAlign: "center",
              }}
            >
              Welcome to My Mobile World
            </Typography>
          </Fade>
        </Box>
      </Box>

      <Box sx={{ flex: 1, position: "relative" }}>
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          {form === "signin" ? (
            <Button
              variant="outlined"
              onClick={handleRegisterClick}
              sx={{
                fontFamily: "monospace",
                color: "black",
                borderColor: "black",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Register
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{
                fontFamily: "monospace",
                color: "black",
                borderColor: "black",
                transition: "all 0.3s ease",
                zIndex: 1000,
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              {"<-Back To Login"}
            </Button>
          )}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "register-button",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                "& .MuiList-root": {
                  py: 0,
                },
                minWidth: 120,
              },
            }}
          >
            <StyledMenuItem onClick={handleVendorClick}>Vendor</StyledMenuItem>
            <StyledMenuItem onClick={handleCustomerClick}>
              Customer
            </StyledMenuItem>
          </Menu>
        </Box>
        {form === "signin" && <SigninForm />}
        {form === "vendorform" && <VendorRegistrationForm />}
        {form === "customerform" && <CustomerRegistrationForm />}
      </Box>
    </Box>
  );
};

export default SignInPage;
