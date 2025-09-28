import { useEffect, useCallback } from 'react';
import { useAuth } from '../components/common/AuthContext';
import apiClient from '../utils/apiClient';

export const useTokenRefresh = () => {
  const { logout, login, isLoggedIn } = useAuth();

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });

      const { token, expiresIn, user } = response.data;
      login(user, token, expiresIn * 1000); // Convert to milliseconds
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [login, logout]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkAndRefreshToken = () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (!tokenExpiry) return;

      const expiryTime = parseInt(tokenExpiry);
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        refreshToken();
      }
    };

    const interval = setInterval(checkAndRefreshToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isLoggedIn, refreshToken]);

  return { refreshToken };
};