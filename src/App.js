import "./App.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import SignInPage from "./pages/LoginPage";
import ProductList from "./components/vendor/ProductList";
import { AuthProvider } from "./components/common/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { PrivateRoute } from "./components/common/PrivateRoute";
import Header from "./components/common/HeaderComponent";
import { Box } from "@mui/material";
import { useAuth } from "./components/common/AuthContext";
import ProductForm from "./components/vendor/CreateProductForm";
import ProductsList from "./components/customer/ProductsList";
import { Provider } from "react-redux";
import store from "./redux/Store";
import Cart from "./components/customer/Cart";

const RoleBasedRoute = ({ children, allowedRole }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData?.userRole;

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    return (
      <Navigate
        to={userRole === "VENDOR" ? "/vendor/products" : "/customer/products"}
        replace
      />
    );
  }

  return children;
};

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData?.userRole;

  const getDefaultRoute = () => {
    if (!isLoggedIn) return "/login";
    return userRole === "VENDOR" ? "/vendor/products" : "/customer/products";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {isLoggedIn && location.pathname !== "/login" && <Header />}
      <Box
        sx={{ mt: isLoggedIn && location.pathname !== "/login" ? "64px" : 0 }}
      >
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />

          <Route
            path="/vendor/products"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="VENDOR">
                  <ProductList />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/vendor/addproduct"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="VENDOR">
                  <ProductForm />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/products"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="customer">
                  <ProductsList />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/cart"
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRole="customer">
                  <Cart />
                </RoleBasedRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to={getDefaultRoute()} replace />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
