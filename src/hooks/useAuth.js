import {useState, useEffect} from 'react'
import AuthService from '../services/authService'

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // có đang check auth status?

    useEffect(() => {
        console.log('checking auth status');
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            const token = AuthService.getToken();
            const userInfo = AuthService.getUserInfo();

            if (token && userInfo) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                if (payload > currentTime) {
                    console.log('Valid token');
                    setIsAuthenticated(true);
                    setUser(userInfo);
                } else {
                    console.log('Outdated toke');
                    LogOut();
                }
            } else {
                console.log('No token or user info found');
                setIsAuthenticated(false);
                setUser(null);
            }  
        } catch(error) {
            console.error('Error checking auth status:', error);
             logout();
        } finally {
            setLoading(false);
        }
    }

     const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      
      const response = await AuthService.signin(credentials);
      
      if (response.token) {
        console.log('Login successful:', response);
        
        setIsAuthenticated(true);
        setUser({ 
          userInfo: response.userInfo, 
          role: response.role 
        });
        
        return response; 
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; 
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    
    AuthService.logout();
    
    setIsAuthenticated(false);
    setUser(null);
    
    console.log('User logged out successfully');
  };

  const refreshAuth = () => {
    console.log('Refreshing auth status...');
    setLoading(true);
    checkAuthStatus();
  };
  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };
}

export default useAuth;