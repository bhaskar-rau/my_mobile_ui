import { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token management
  const getStoredAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      
      if (!token || !userData || !tokenExpiry) {
        return null;
      }

      // Check if token is expired
      if (new Date().getTime() > parseInt(tokenExpiry)) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        return null;
      }

      return {
        token,
        user: JSON.parse(userData),
        expiry: parseInt(tokenExpiry)
      };
    } catch (error) {
      console.error("Error parsing stored auth data:", error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      setUser(storedAuth.user);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, [getStoredAuth]);

  // Auto-logout on token expiry
  useEffect(() => {
    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        logout();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = (userData, token = null, expiresIn = 24 * 60 * 60 * 1000) => { // Default 24 hours
    const expiry = new Date().getTime() + expiresIn;
    
    setUser(userData);
    setIsLoggedIn(true);
    
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("authToken", token);
    }
    localStorage.setItem("tokenExpiry", expiry.toString());
  };

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
  }, []);

  const getAuthToken = () => {
    const storedAuth = getStoredAuth();
    return storedAuth?.token || null;
  };

  const isTokenValid = () => {
    const storedAuth = getStoredAuth();
    return !!storedAuth;
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout, 
      getAuthToken, 
      isTokenValid,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
