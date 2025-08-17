import axios from "axios";
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'https://travel-trip-ten.vercel.app/api/v1',
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Set Content-Type based on data type
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Add auth token if exists
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (token expired)
       Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Something went wrong';
    return Promise.reject(errorMessage);
  }
);

export default instance;