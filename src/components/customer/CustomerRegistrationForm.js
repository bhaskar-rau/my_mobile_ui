import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  submitCustomerForm,
  setFormData,
  resetFormData,
} from "../../redux/customerSlice";
import { validateField } from "./validation"; 
import {customerFields} from "./fields"

import RegistrationSuccess from "../common/RegistrationSuccess";

const CustomerRegistrationForm = () => {
  const dispatch = useDispatch();
  const { status, error, response } = useSelector((state) => state.customer);
  const formData = useSelector((state) => state.customer);

  const [showSuccess , setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState("+91");

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    
    if (name === "userId") {
      const alphaNumericRegex = /^[A-Z0-9]*$/;
      if (!alphaNumericRegex.test(value)) return; 
    }
    if (name === "userNumber" || name === "userPincode") {
      if (!/^\d*$/.test(value)) return; 
    }

    dispatch(setFormData({ name, value }));

    const fieldError = validateField(name, value, formData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field] || "", formData);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(submitCustomerForm(formData))
        .unwrap()
        .then(() => {
          dispatch(resetFormData());
          setShowSuccess(true);
        });
    }
  };

  if (showSuccess) {
    return <RegistrationSuccess email={formData.email} />
  }



  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "80%", padding: "20px" }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
            Customer Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {customerFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    fullWidth
                    variant="outlined"
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.userRole}
                >
                  <InputLabel>User Role</InputLabel>
                  <Select
                    label="User Role"
                    name="userRole"
                    value={formData.userRole || "customer"}
                    onChange={handleChange}
                  >
                    <MenuItem value="customer">Customer</MenuItem>

                  </Select>
                  {errors.userRole && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ marginTop: "5px" }}
                    >
                      {errors.userRole}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  {status === "loading" ? "Registering..." : "Register"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerRegistrationForm;
