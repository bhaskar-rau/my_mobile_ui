import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useAuth } from "./AuthContext";
export const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};
