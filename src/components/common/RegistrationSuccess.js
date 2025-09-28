import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const RegistrationSuccess = ({ email }) => {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CheckCircleIcon
        sx={{
          color: "#4CAF50",
          fontSize: 64,
          mb: 2,
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: "monospace",
          textAlign: "center",
          letterSpacing: "-1px",
        }}
      >
        Registration Successful!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "monospace",
          textAlign: "center",
          mt: 1,
        }}
      >
        Verification email has been sent to
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "monospace",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {email}
      </Typography>
    </Box>
  );
};

export default RegistrationSuccess;
