import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addProductToCartAPI } from "../../redux/cartSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleAddToCart = useCallback(async (product, itemQuantity) => {
    if (itemQuantity <= 0) {
      setNotification({
        open: true,
        message: 'Please select a quantity greater than 0',
        severity: 'warning'
      });
      return;
    }

    if (itemQuantity > product.quantity) {
      setNotification({
        open: true,
        message: `Only ${product.quantity} items available in stock`,
        severity: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(addProductToCartAPI({ product, itemQuantity })).unwrap();
      setNotification({
        open: true,
        message: `${itemQuantity} ${itemQuantity === 1 ? 'item' : 'items'} added to cart!`,
        severity: 'success'
      });
      setQuantity(0); // Reset quantity after successful add
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to add item to cart. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, product]);

  const increaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      if (newQuantity > product.quantity) {
        setNotification({
          open: true,
          message: `Maximum available quantity is ${product.quantity}`,
          severity: 'warning'
        });
        return product.quantity;
      }
      return newQuantity;
    });
  }, [product.quantity]);

  const decreaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => Math.max(0, prevQuantity - 1));
  }, []);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(value, product.quantity));
    
    if (value > product.quantity) {
      setNotification({
        open: true,
        message: `Maximum available quantity is ${product.quantity}`,
        severity: 'warning'
      });
    }
    
    setQuantity(clampedValue);
  }, [product.quantity]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const formattedPrice =
    typeof product.price === "number"
      ? `₹${product.price.toLocaleString("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : "₹0";

  const isOutOfStock = product.quantity <= 0;
  const isQuantityValid = quantity > 0 && quantity <= product.quantity;

  return (
    <Card
      sx={{
        maxWidth: 300,
        margin: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxShadow: 3,
      }}
    >
      {/* Product Image */}
      {imageError ? (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
          <Typography variant="caption" color="text.secondary">
            Image not available
          </Typography>
        </Box>
      ) : (
        <CardMedia
          component="img"
          src={
            product.imageOfProduct
              ? `data:image/jpeg;base64,${product.imageOfProduct}`
              : "https://via.placeholder.com/200/cccccc/666666?text=No+Image"
          }
          alt={`${product.brand} ${product.model}`}
          onError={handleImageError}
          sx={{ height: 200, objectFit: "cover" }}
        />
      )}

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        {/* Brand Name */}
        <Typography variant="h6" gutterBottom>
          {String(product.brand || "Unknown Brand")}
        </Typography>

        {/* Model Name */}
        <Typography variant="subtitle1" gutterBottom>
          {String(product.model || "Unknown Model")}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {String(product.description || "No description available")}
        </Typography>

        <Divider sx={{ marginY: 1 }} />

        {/* Additional Information */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Color:</strong> {String(product.color || "N/A")}
        </Typography>
        <Typography 
          variant="body2" 
          color={isOutOfStock ? "error.main" : "text.secondary"} 
          gutterBottom
          sx={{ fontWeight: isOutOfStock ? 'bold' : 'normal' }}
        >
          <strong>Stock:</strong>{" "}
          {isOutOfStock ? "Out of Stock" : `${product.quantity} available`}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Features:</strong> {String(product.productFeatures || "N/A")}
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {/* Price */}
        <Box
          sx={{
            backgroundColor: "black",
            color: "white",
            display: "inline-block",
            padding: "5px 10px",
            borderRadius: 1,
            marginBottom: 2,
            width: "fit-content",
          }}
        >
          <Typography variant="h6">{formattedPrice}</Typography>
        </Box>

        {/* Quantity Control */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <IconButton
            onClick={decreaseQuantity}
            disabled={quantity <= 0 || isOutOfStock}
            sx={{ 
              backgroundColor: "grey.300", 
              padding: "6px",
              '&:disabled': { backgroundColor: 'grey.200' }
            }}
            aria-label="Decrease quantity"
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={quantity}
            name="quantity"
            onChange={handleQuantityChange}
            type="number"
            disabled={isOutOfStock}
            slotProps={{
              htmlInput: { 
                min: 0, 
                max: product.quantity,
                'aria-label': 'Product quantity'
              }
            }}
            sx={{ 
              width: "70px", 
              '& input': { textAlign: "center" },
              '& .MuiInputBase-input:disabled': {
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.38)'
              }
            }}
          />
          <IconButton
            onClick={increaseQuantity}
            disabled={quantity >= product.quantity || isOutOfStock}
            sx={{ 
              backgroundColor: "grey.300", 
              padding: "6px",
              '&:disabled': { backgroundColor: 'grey.200' }
            }}
            aria-label="Increase quantity"
          >
            <AddIcon />
          </IconButton>
        </Box>
        
        {quantity > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Total: {formattedPrice.replace('₹', '₹')} × {quantity} = ₹{(product.price * quantity).toLocaleString("en-IN")}
          </Typography>
        )}

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          onClick={() => handleAddToCart(product, quantity)}
          fullWidth
          disabled={!isQuantityValid || isLoading || isOutOfStock}
          sx={{
            backgroundColor: isOutOfStock ? "grey.400" : "primary.main",
            "&:hover": {
              backgroundColor: isOutOfStock ? "grey.400" : "primary.dark",
            },
            padding: "10px 0",
            position: 'relative'
          }}
          aria-label={isOutOfStock ? "Product out of stock" : "Add to cart"}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : !isQuantityValid ? (
            "Select Quantity"
          ) : (
            `Add ${quantity} to Cart`
          )}
        </Button>
      </CardContent>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ProductCard;
