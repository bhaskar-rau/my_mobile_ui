import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  TextField,
  IconButton,
  Collapse,
  Grid,
  TablePagination,
  Stack,
  Select,
  MenuItem,
  Button,
  Chip,
  Card,
  CircularProgress,
  FormControl,
  CardContent,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  FormatListBulleted as FeaturesIcon,
  Image as ImageIcon,
  Add,
  Inventory,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Row = ({ product }) => {
  const [openDescription, setOpenDescription] = useState(false);
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <>
      <TableRow
        sx={{
          "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
          "&:hover": { backgroundColor: "#eaeaea" },
          transition: "background-color 0.2s ease",
        }}
      >
        <TableCell sx={{ fontFamily: "monospace" }}>
          {product.productId}
        </TableCell>
        <TableCell sx={{ fontFamily: "monospace" }}>{product.model}</TableCell>
        <TableCell sx={{ fontFamily: "monospace" }}>{product.brand}</TableCell>
        <TableCell sx={{ fontFamily: "monospace" }}>
          {formatPrice(product.price)}
        </TableCell>
        <TableCell sx={{ fontFamily: "monospace" }}>
          {product.quantity}
        </TableCell>
        <TableCell sx={{ fontFamily: "monospace" }}>{product.color}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => setOpenImage(!openImage)}
              sx={{
                bgcolor: openImage ? "grey.300" : "black",
                color: openImage ? "black" : "white",
                "&:hover": {
                  bgcolor: openImage ? "grey.400" : "grey.800",
                },
              }}
            >
              <ImageIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpenDescription(!openDescription)}
              sx={{
                bgcolor: openDescription ? "grey.300" : "black",
                color: openDescription ? "black" : "white",
                "&:hover": {
                  bgcolor: openDescription ? "grey.400" : "grey.800",
                },
              }}
            >
              <DescriptionIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpenFeatures(!openFeatures)}
              sx={{
                bgcolor: openFeatures ? "grey.300" : "black",
                color: openFeatures ? "black" : "white",
                "&:hover": {
                  bgcolor: openFeatures ? "grey.400" : "grey.800",
                },
              }}
            >
              <FeaturesIcon fontSize="small" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse
            in={openDescription || openFeatures || openImage}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 2 }}>
              <Grid container spacing={2}>
                {openImage && (
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Product Image
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 2,
                            minHeight: "250px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "12px",
                          }}
                        >
                          <img
                            src={
                              product.imageOfProduct
                                ? `data:image/jpeg;base64,${product.imageOfProduct}`
                                : "https://via.placeholder.com/200/000000/FFFFFF?text=No+Image"
                            }
                            alt={product.model}
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "contain",
                              borderRadius: "8px",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              backgroundColor: "white",
                              padding: "8px",
                            }}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/200/000000/FFFFFF?text=${encodeURIComponent(
                                product.model
                              )}`;
                              e.target.onerror = null;
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {openDescription && (
                  <Grid item xs={12} md={openFeatures || openImage ? 4 : 12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Description
                        </Typography>
                        <Typography>{product.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {openFeatures && (
                  <Grid item xs={12} md={openDescription || openImage ? 4 : 12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Features
                        </Typography>
                        {product.productFeatures
                          .split(", ")
                          .map((feature, index) => (
                            <Chip
                              key={index}
                              label={feature}
                              sx={{ m: 0.5 }}
                              variant="outlined"
                            />
                          ))}
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const NumericFilter = ({ value, onChange, label }) => (
  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
    <FormControl size="small" sx={{ minWidth: 80 }}>
      <Select
        value={value.operator}
        onChange={(e) => onChange({ ...value, operator: e.target.value })}
        variant="standard"
        sx={{
          color: "white",
          "&:before, &:after": { borderColor: "rgba(255, 255, 255, 0.5)" },
        }}
      >
        <MenuItem value="=">Equal to</MenuItem>
        <MenuItem value=">">&gt;</MenuItem>
        <MenuItem value="<">&lt;</MenuItem>
        <MenuItem value=">=">&gt;=</MenuItem>
        <MenuItem value="<=">&lt;=</MenuItem>
      </Select>
    </FormControl>
    <TextField
      size="small"
      value={value.value}
      onChange={(e) => onChange({ ...value, value: e.target.value })}
      variant="standard"
      placeholder={`Enter ${label.toLowerCase()}...`}
      type="number"
      sx={{
        "& .MuiInput-root": {
          color: "white",
          "&:before, &:after": { borderColor: "rgba(255, 255, 255, 0.5)" },
        },
      }}
    />
  </Box>
);

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    productId: "",
    model: "",
    brand: "",
    color: "",
    price: { operator: "=", value: "" },
    quantity: { operator: "=", value: "" },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData.userId;

      const response = await axios.get(
        `http://192.168.0.124:9998/vendor/products/${userId}`
      );
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
      console.log(response.data);
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (field) => (event) => {
    const newFilters = {
      ...filters,
      [field]: event.target.value,
    };
    applyFilters(newFilters);
  };

  const handleNumericFilterChange = (field) => (value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    applyFilters(newFilters);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);

    const filtered = products.filter((product) => {
      return Object.entries(newFilters).every(([key, filter]) => {
        if (typeof filter === "object") {
          if (!filter.value) return true;
          const productValue = parseFloat(product[key]);
          const filterValue = parseFloat(filter.value);

          switch (filter.operator) {
            case ">":
              return productValue > filterValue;
            case "<":
              return productValue < filterValue;
            case ">=":
              return productValue >= filterValue;
            case "<=":
              return productValue <= filterValue;
            default:
              return productValue === filterValue;
          }
        } else {
          // Text filter
          return (
            !filter ||
            String(product[key]).toLowerCase().includes(filter.toLowerCase())
          );
        }
      });
    });

    setFilteredProducts(filtered);
    setPage(0);
  };

  const LoadingState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: "black",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Typography
        sx={{
          fontFamily: "monospace",
          color: "black",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        Loading products...
      </Typography>
    </Box>
  );

  const EmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2,
      }}
    >
      <Inventory
        sx={{
          fontSize: 48,
          color: "black",
          mb: 1,
        }}
      />
      <Typography
        sx={{
          fontFamily: "monospace",
          color: "black",
          fontSize: "1.1rem",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        No products available
      </Typography>
      <Typography
        sx={{
          fontFamily: "monospace",
          color: "grey.600",
          fontSize: "0.9rem",
          textAlign: "center",
        }}
      >
        Try adjusting your filters or add a new product
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add fontSize="small" />}
        size="small"
        onClick={handleAddProduct}
        sx={{
          backgroundColor: "black",
          color: "white",
          fontFamily: "monospace",
          "&:hover": {
            backgroundColor: "grey.800",
          },
          textTransform: "none",
          mt: 2,
          py: 1,
          px: 3,
        }}
      >
        Add Apple Product
      </Button>
    </Box>
  );

  const ErrorState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2,
      }}
    >
      <ErrorIcon
        sx={{
          fontSize: 48,
          color: "black",
          mb: 1,
        }}
      />
      <Typography
        sx={{
          fontFamily: "monospace",
          color: "black",
          fontSize: "1.1rem",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        Oops! Something went wrong
      </Typography>
      <Typography
        sx={{
          fontFamily: "monospace",
          color: "grey.600",
          fontSize: "0.9rem",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        {error}
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshIcon fontSize="small" />}
        size="small"
        onClick={fetchProducts}
        sx={{
          backgroundColor: "black",
          color: "white",
          fontFamily: "monospace",
          "&:hover": {
            backgroundColor: "grey.800",
          },
          textTransform: "none",
          mt: 2,
          py: 1,
          px: 3,
        }}
      >
        Try Again
      </Button>
    </Box>
  );

  const renderHeaderCell = (field, label) => {
    if (field === "price" || field === "quantity") {
      return (
        <TableCell>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "monospace", fontWeight: "bold" }}
            >
              {label}
            </Typography>
            <NumericFilter
              value={filters[field]}
              onChange={handleNumericFilterChange(field)}
              label={label}
            />
          </Box>
        </TableCell>
      );
    }

    return (
      <TableCell>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontFamily: "monospace", fontWeight: "bold" }}
          >
            {label}
          </Typography>
          {field in filters && typeof filters[field] === "string" && (
            <TextField
              size="small"
              value={filters[field]}
              onChange={handleFilterChange(field)}
              variant="standard"
              placeholder={`Search ${label.toLowerCase()}...`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInput-root": {
                  color: "white",
                  "&:before, &:after": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "& .MuiInputAdornment-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                },
                "& input::placeholder": { color: "rgba(255, 255, 255, 0.7)" },
              }}
            />
          )}
        </Box>
      </TableCell>
    );
  };

  const handleAddProduct = () => {
    navigate("/vendor/addproduct");
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 6, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontFamily: "monospace",
              letterSpacing: "-0.5px",
              fontSize: "1.5rem",
            }}
          >
            Apple Products Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add fontSize="small" />}
            size="small"
            onClick={handleAddProduct}
            sx={{
              backgroundColor: "black",
              color: "white",
              fontFamily: "monospace",
              "&:hover": {
                backgroundColor: "grey.800",
              },
              textTransform: "none",
              py: 0.5,
              fontSize: "0.875rem",
            }}
          >
            Add Apple Product
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            "& .MuiTableCell-head": {
              backgroundColor: "black",
              color: "white",
              fontFamily: "monospace",
            },
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {renderHeaderCell("productId", "Product ID")}
                {renderHeaderCell("model", "Model")}
                {renderHeaderCell("brand", "Brand")}
                {renderHeaderCell("price", "Price")}
                {renderHeaderCell("quantity", "Quantity")}
                {renderHeaderCell("color", "Color")}
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: 0 }}>
                    <LoadingState />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: 0 }}>
                    <ErrorState />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: 0 }}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <Row key={product.productId} product={product} />
                  ))
              )}
            </TableBody>
          </Table>
          {!isLoading && !error && filteredProducts.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          )}
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ProductList;
