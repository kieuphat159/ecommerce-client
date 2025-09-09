import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);
console.log(requiredRole);
  useEffect(() => {
    checkAuthorization();
  }, [requiredRole]);

  const checkAuthorization = async () => {
    try {
      const token = authService.getToken();
      
      console.log('=== ProtectedRoute Debug ===');
      console.log('Token exists:', !!token);
      console.log('Required Role:', requiredRole);
      
      if (!token) {
        console.log('No token found, redirecting to signin');
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // Decode JWT để lấy role (hoặc gọi API để verify)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      console.log('Token payload:', payload);
      console.log('Current time:', currentTime);
      console.log('Token exp:', payload.exp);
      console.log('Token valid:', payload.exp > currentTime);

      // Kiểm tra token hết hạn
      if (payload.exp < currentTime) {
        console.log('Token expired, clearing and redirecting');
        authService.refreshAccessToken();
        setLoading(false);
        return;
      }

      setUserRole(payload.role);
      console.log('User role from token:', payload.role);

      // Kiểm tra role nếu có yêu cầu
      if (requiredRole && payload.role !== requiredRole) {
        console.log(`Role mismatch: required ${requiredRole}, got ${payload.role}`);
        setIsAuthorized(false);
      } else {
        console.log('Authorization successful');
        setIsAuthorized(true);
      }

    } catch (error) {
      console.error('Error checking authorization:', error);
      authService.clearAuthData();
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Chuyển hướng dựa trên lý do từ chối
    const token = authService.getToken();
    
    if (!token) {
      console.log('Redirecting to signin: No token');
      return <Navigate to="/signin" replace />;
    } else if (requiredRole && userRole !== requiredRole) {
      console.log('Redirecting to home: Wrong role');
      return <Navigate to="/" replace />;
    } else {
      console.log('Redirecting to signin: Token expired or other error');
      return <Navigate to="/signin" replace />;
    }
  }

  console.log('Rendering protected content');
  return children;
};

export default ProtectedRoute;