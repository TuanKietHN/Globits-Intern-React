import axios from 'axios';

// API Service không cần authentication - dùng cho testing
class ApiService {
  constructor() {
    // CHỈNH PORT THEO BACKEND ĐANG CHẠY: port 8071
    this.baseURL = import.meta.env.VITE_API || 'http://localhost:8071';
    // Tạo axios instance riêng để không ảnh hưởng đến axios global
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    this.setupInterceptors();
    
    // TỰ ĐỘNG thiết lập auth headers nếu có token trong localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.setAuthHeaders(token);
    }
  }

  // Method để thêm auth headers khi cần
  setAuthHeaders(token) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  setupInterceptors() {
    // Request interceptor - thêm CORS headers và config
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Thêm headers để tránh CORS issues
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // GET method
  async get(endpoint) {
    try {
      const response = await this.axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST method
  async post(endpoint, data) {
    try {
      const response = await this.axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT method
  async put(endpoint, data) {
    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE method
  async delete(endpoint) {
    try {
      const response = await this.axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server');
    } else {
      // Something else happened
      return new Error('Request failed');
    }
  }
}

export const apiService = new ApiService();