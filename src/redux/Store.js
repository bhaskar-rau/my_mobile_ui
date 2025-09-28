import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import customerReducer from "./customerSlice";
import productReducer from "./productSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer, // Reducer for cart state
    customer: customerReducer, // Reducer for customer state
    products: productReducer, // Reducer for product state
  },
});

export default store;
