class AuthService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api/auth';
        this.token = localStorage.getItem('authToken') || null;
        this.userInfo = localStorage.getItem('userInfo') || null;
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('authToken');
        }
        return this.token;
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        console.log('User info saved:', userInfo); // Debug
    }


    getUserInfo() {
        return this.userInfo;
    }

    clearAuthData() {
        this.token = null;
        this.userInfo = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
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
            return await response.json();
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
                this.clearToken();
            }
            return result;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    // seller methods
    async getSellerPage() {
        return this.apiCall('/seller', { method: 'GET' });
    }

    // logout
    logout() {
        this.clearToken();
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp <= currentTime) {
                this.clearToken();
                return false;
            }
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            this.clearToken();
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
            this.clearToken();
            return false;
        }
    }
}

export default new AuthService();