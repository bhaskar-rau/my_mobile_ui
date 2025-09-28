import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCartAPI,
  fetchCartData,
  removeFromCart,
  updateCartItem,
  removeProductFromCartAPI,
  clearCart,
} from "../../redux/cartSlice";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import CheckoutSuccess from "../common/CheckoutSuccess";

import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartData = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const Quantity = useSelector((state) => state.cart.totalQuantity);
  const Price = useSelector((state) => state.cart.totalPrice);

  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartData(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    let quantity = 0;
    let price = 0;

    cartData.forEach((item) => {
      quantity += item.quantity;
      price += item.quantity * item.price;
      console.log("item id: ", item.id);
    });

    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, [cartData]);

  const handleRemoveProduct = async (item) => {
    try {
      const actionResult = await dispatch(
        removeProductFromCartAPI({ userId, productId: item.productId })
      );

      if (removeProductFromCartAPI.fulfilled.match(actionResult)) {
        dispatch(removeFromCart(item.productId));
      } else {
        console.error(
          "Error while removing product from cart:",
          actionResult.payload
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleGoToProductsList = () => {
    navigate("/customer/products");
  };

  const handleCheckout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData.userId;

      const cartIteams = cartData;

      const response = await axios.put(
        `http://192.168.0.124:9998/cart/checkout/${userId}`,
        cartIteams
      );

      if (response.status === 200) {
        setIsCheckoutSuccess(true);
        setTimeout(() => {
          navigate("/customer/products");
        }, 2000);
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const CartProducts = () => (
    <Grid container spacing={2} flex={2}>
      {cartData.length > 0 ? (
        cartData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.productId}>
            <Card>
              <CardMedia
                component="img"
                src={
                  item.imageOfProduct
                    ? `data:image/jpeg;base64,${item.imageOfProduct}`
                    : "https://via.placeholder.com/200/000000/FFFFFF?text=No+Image"
                }
                alt={item.brand}
                sx={{ height: 200, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6">{item.model}</Typography>
                <Typography variant="body2">
                  ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                </Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    marginTop: 1,
                  }}
                >
                  <Typography>{Quantity}</Typography>
                </Box>
                <IconButton
                  sx={{ marginTop: 1 }}
                  onClick={() => handleRemoveProduct(item)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>
          Your cart is empty.
          <Button onClick={handleGoToProductsList}>Go To Products</Button>
        </Typography>
      )}
    </Grid>
  );

  const CartSummary = () => (
    <Box flex={1}>
      <Typography variant="h6">Cart Summary</Typography>
      <Box sx={{ marginTop: 2 }}>
        <Typography>Total Items: {Quantity}</Typography>
        <Typography>
          Total Price: ₹{new Intl.NumberFormat("en-IN").format(Price)}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        disabled={totalQuantity === 0}
        onClick={handleCheckout}
      >
        Checkout
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {isCheckoutSuccess ? (
        <CheckoutSuccess />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            <Button onClick={handleGoToProductsList} variant="contained">
              Go To Products
            </Button>
          </Typography>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {cartData.length === 0 && !loading ? (
            <Typography variant="h6" sx={{ textAlign: "center", marginTop: 3 }}>
              Your cart is empty.
            </Typography>
          ) : (
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={3}
            >
              <CartProducts />
              <CartSummary />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Cart;
