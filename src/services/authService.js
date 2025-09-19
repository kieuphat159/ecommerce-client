class AuthService {
    constructor() {
        this.apiUrl = `${import.meta.env.VITE_API_URL}/api/auth`;
        this.token = localStorage.getItem('authToken') || null;
        this.userInfo = localStorage.getItem('userInfo') || null;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('authToken');
        }
        return this.token;
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('User info saved:', userInfo);
    }

    getUserInfo() {
        if (!this.userInfo) {
            const saved = localStorage.getItem('userInfo');
            this.userInfo = saved ? JSON.parse(saved) : null;
        }
        return this.userInfo;
    }

    clearAuthData() {
        
        this.token = null;
        this.userInfo = null;
        localStorage.clear();
    }


    // authentication methods
    async signup(name, username, email, password, role) {
        try {
            const response = await fetch(`${this.apiUrl}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, email, password, role })
            });
            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }


    async signin(credential) {
        try {
            const response = await fetch(`${this.apiUrl}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credential)
            });
            const data = await response.json();
            if (data.token) {
                this.logout();
                this.setToken(data.token);

                if (data.userInfo) {
                    this.setUserInfo(data.userInfo);
                }
            }
            localStorage.setItem("userId", data.userId);
            return data;
        } catch (error) {
            console.error('Signin error:', error);
            throw error;
        }
    }

            
    async apiCall(endpoint, options = {}) {
        const token = this.getToken();
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization' :`Bearer ${token}` }),
                ...options.headers
            }
        };
        try {
            const respone = await fetch(`${this.apiUrl}${endpoint}`, config);
            const result = await respone.json();

            if (respone.status === 401 || respone.status === 403) {
                this.clearAuthData();
            }
            return result;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    refreshAccessToken = async () => {
        try {
            const response = await fetch(`${this.apiUrl}/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Lỗi làm mới token: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.token) {
                throw new Error('Không nhận được token từ server');
            }

            this.setToken(data.token);
            return data.token;
        } catch (error) {
            console.error('Lỗi làm mới token:', error);
            this.logout();
            throw error;
        }
    };
    // seller methods
    async getSellerPage() {
        return this.apiCall('/seller', { method: 'GET' });
    }

    // logout
    logout() {
        
        this.clearAuthData();
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp <= currentTime) {
                this.clearAuthData();
                return false;
            }
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            this.clearAuthData();
            return false;
        }
    }

    getUserRole() {
        const token = this.getToken();
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    restoreSession() {
        if (this.isAuthenticated()) {
            return true;
        } else {
            this.clearAuthData();
            return false;
        }
    }
}

export default new AuthService();