import { makeAutoObservable } from 'mobx';

class AuthStore {
  user = null;
  token = localStorage.getItem('token');
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  initializeAuth() {
    if (this.token) {
      this.user = this.parseToken(this.token);
    }
  }

  parseToken(token) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }

  async login(username, password) {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API || 'http://localhost:8071'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      this.user = this.parseToken(this.token);
      localStorage.setItem('token', this.token);
      
      return { success: true };
    } catch (error) {
      this.error = error.message;
      return { success: false, error: error.message };
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    this.error = null;
    localStorage.removeItem('token');
  }

  get isAuthenticated() {
    return !!this.token && !!this.user;
  }

  get authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

export const authStore = new AuthStore();