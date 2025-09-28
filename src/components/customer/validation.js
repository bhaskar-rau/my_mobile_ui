

// Validation rules for each field
export const validationRules = {
    userId: (value) => {
      if (!value) return "User ID cannot be null";
      if (!/^[A-Z0-9]*$/.test(value)) return "User ID must contain only uppercase alphanumeric characters";
      return "";
    },
    userName: (value) => (!value ? "Username cannot be null" : ""),
    userPassword: (value) => {
      if (!value) return "Password cannot be null";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    },
    userConfirmPassword: (value, formData) => {
      if (!value) return "Confirm Password cannot be null";
      if (value !== formData.userPassword) return "Passwords do not match";
      return "";
    },
    userEmail: (value) => {
      if (!value) return "Email cannot be null";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return "";
    },
    userNumber: (value) => {
      if (!value) return "Phone number cannot be null";
      if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
      return "";
    },
    userPincode: (value) => {
      if (!value) return "Pincode cannot be null";
      if (!/^\d{6}$/.test(value)) return "Pincode must be 6 digits";
      return "";
    },
    userPanNumber: (value) => {
        if (!value) {
          return "PAN Number cannot be null"; // Check if the field is empty
        }
        if (value.length !== 10) {
          return "PAN Number must be exactly 10 characters"; // Check length
        }
        if (!/^[A-Z0-9]+$/.test(value)) {
          return "PAN Number must contain only uppercase alphabets and numbers"; // Check alphanumeric format
        }
        return ""; // No errors
      },
      
    userAddress: (value) => (!value ? "Address cannot be null" : ""),
  };
  
  // Validation function that applies rules
  export const validateField = (name, value, formData = {}) => {
    if (validationRules[name]) {
      return validationRules[name](value, formData);
    }
    return "";
  };
  