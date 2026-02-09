import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://bus-booking-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Route API
export const routeAPI = {
  searchRoutes: (params) => api.get('/routes/search', { params }),
  getAllRoutes: () => api.get('/routes'),
  getRoute: (id) => api.get(`/routes/${id}`),
  createRoute: (data) => api.post('/routes', data),
  updateRoute: (id, data) => api.put(`/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/routes/${id}`)
};

// Bus API
export const busAPI = {
  getAllBuses: () => api.get('/buses'),
  getBus: (id) => api.get(`/buses/${id}`),
  createBus: (data) => api.post('/buses', data),
  updateBus: (id, data) => api.put(`/buses/${id}`, data),
  deleteBus: (id) => api.delete(`/buses/${id}`)
};

// Booking API
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAllBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`)
};

export default api;
