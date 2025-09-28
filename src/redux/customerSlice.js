import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userName: "",
  userPassword: "",
  userConfirmPassword: "",
  userNumber: "",
  email: "",
  userMobileNum: "",
  userAddress: "",
  userPincode: "",
  userGstNumber: "",
  userPanNumber: "",
  userRole: "CUSTOMER",
  status: "idle", // Could be 'idle', 'loading', 'succeeded', 'failed'
  error: null,
  response: null,
};

export const submitCustomerForm = createAsyncThunk(
  "customer/submitForm",
  async (formData, { rejectWithValue }) => {
    try {
      // Make the POST request to the server
      const response = await fetch(`http://192.168.0.124:9998/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },

    resetFormData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCustomerForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitCustomerForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.response = action.payload;

        Object.keys(initialState).forEach((key) => {
          if (key !== "status" && key !== "error" && key !== "response") {
            state[key] = "";
          }
        });
      })
      .addCase(submitCustomerForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Something went wrong"; // Display error message
      });
  },
});

export const { setFormData, resetFormData } = customerSlice.actions;

export default customerSlice.reducer;
