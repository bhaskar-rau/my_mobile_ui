import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("http://192.168.0.124:9998/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  }
);

// Product Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer to be added to the store
export default productSlice.reducer;
