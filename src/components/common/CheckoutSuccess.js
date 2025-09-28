import React from "react";
import { Box, Typography } from "@mui/material";

const CheckoutSuccess = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <img
        src={require("../../assets/mobile-logo-icon-only.png")}
        alt="Logo"
        style={{
          width: "70px",
          height: "70px",
          marginBottom: "1.5rem",
        }}
      />
      <Typography
        variant="h4"
        sx={{ fontFamily: "monospace", fontWeight: "bold" }}
      >
        Checkout Successful!
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
        Your order has been placed successfully
      </Typography>
    </Box>
  );
};

export default CheckoutSuccess;
