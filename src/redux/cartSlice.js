import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://192.168.0.124:9998/cart/${userId}`
      );
      return response.data; // Assuming response is an array of cart items
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch cart data"
      );
    }
  }
);

export const addProductToCartAPI = createAsyncThunk(
  "cart/addProductToCartAPI",
  async ({ product, itemQuantity }, { rejectWithValue }) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    console.log("product", product);
    console.log("item quantity", itemQuantity);
    try {
      const payload = {
        ...product, // Include the entire product object
        itemQuantity: itemQuantity, // Ensure we use the cart item's quantity
      };

      const response = await axios.post(
        `http://192.168.0.124:9998/cart/addtocart/${userData.userId}`,
        payload // Send the updated product object with the correct quantity
      );

      return response.data; // Return the updated cart data (including the new item)
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add product to cart"
      );
    }
  }
);

export const removeProductFromCartAPI = createAsyncThunk(
  "cart/removeProductFromCartAPI",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      // Send DELETE request to remove product from cart
      const response = await axios.delete(
        `http://192.168.0.124:9998/cart/remove?userId=${userId}&productId=${productId}`
      );
      return response.data; // Assuming response contains updated cart info after removal
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove product from cart"
      );
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  "cart/clearCart",
  async (userId) => {
    const response = await axios.post(
      `http://192.168.0.124:9998/cart/clear/${userId}`
    );
    return response.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity, price } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, quantity, price });
      }

      state.totalQuantity += quantity;
      state.totalPrice += price * quantity;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const itemToRemove = state.items.find(
        (item) => item.productId === productId
      );

      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
        state.items = state.items.filter(
          (item) => item.productId !== productId
        );
      }
    },
    updateCartItem: (state, action) => {
      const updatedProduct = action.payload; // Get the updated product object
      const itemToUpdate = state.items.find(
        (item) => item.productId === updatedProduct.productId
      );

      if (itemToUpdate) {
        const quantityDiff =
          updatedProduct.itemQuantity - itemToUpdate.quantity;
        state.totalQuantity += quantityDiff;
        state.totalPrice += quantityDiff * itemToUpdate.price;
        itemToUpdate.quantity = updatedProduct.itemQuantity; // Update the quantity of the item
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart data
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;

        // Ensure the items array is correctly extracted from the response
        const items = action.payload || []; // Assuming payload is an array of items
        state.items = items.map((item) => ({
          barcodeid: item.barcodeid,
          productId: item.productId,
          itemQuantity: item.itemQuantity,
          model: item.model,
          price: item.price,
          brand: item.brand,
          imageOfProduct: item.imageOfProduct,
        }));

        // Calculate total quantity and price
        state.totalQuantity = items.reduce(
          (total, item) => total + item.itemQuantity,
          0
        );
        state.totalPrice = items.reduce(
          (total, item) => total + item.price * item.itemQuantity,
          0
        );
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while fetching the cart data.";
      })
      // Add product to cart...
      .addCase(addProductToCartAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const existingItem = state.items.find(
          (item) => item.productId === product.productId
        );

        if (existingItem) {
          existingItem.quantity += product.itemQuantity;
        } else {
          state.items.push({
            productId: product.productId,
            quantity: product.itemQuantity,
            price: product.price,
            brand: product.brand,
            imageOfProduct: product.imageOfProduct,
          });
        }

        state.totalQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalPrice = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(addProductToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product to cart";
      })
      // Remove product from cart...
      .addCase(removeProductFromCartAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProductFromCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        const { items, totalQuantity, totalPrice } = action.payload;
        state.items = items || [];
        state.totalQuantity = totalQuantity || 0;
        state.totalPrice = totalPrice || 0;
      })
      .addCase(removeProductFromCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove product from cart";
      });
  },
});

export const { addToCart, clearCart, removeFromCart, updateCartItem } =
  cartSlice.actions;
export default cartSlice.reducer;
