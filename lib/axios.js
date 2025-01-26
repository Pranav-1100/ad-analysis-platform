import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ad-analysis.trou.hackclub.app/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// API handlers for different analysis types
export const analyzeAd = async (formData, type) => {
  const endpoints = {
    qc: '/ads/qc',
    crm: '/ads/analysis',
    competitor: '/competitor/analyze',
    batch: '/competitor/batch',
    compare: '/competitor/compare',
    fetch: '/fetch-ads'
  };

  try {
    const response = await axiosInstance.post(endpoints[type], formData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Batch analysis handler
export const analyzeBatch = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await axiosInstance.post('/competitor/batch', formData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Competitor category insights
export const getCompetitorInsights = async (category) => {
  try {
    const response = await axiosInstance.get(`/competitor/insights/${category}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Compare with dataset
export const compareWithDataset = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post('/competitor/compare', formData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch ads from social media
export const fetchAds = async (params) => {
  try {
    const response = await axiosInstance.post('/fetch-ads', params, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Error handler
const handleApiError = (error) => {
  let errorMessage = 'An error occurred during the request';

  if (error.response) {
    // Server responded with error
    errorMessage = error.response.data.message || 'Server error occurred';
    console.error('Server Error:', error.response.data);
  } else if (error.request) {
    // Request made but no response
    errorMessage = 'No response received from server';
    console.error('Network Error:', error.request);
  } else {
    // Error setting up request
    errorMessage = error.message;
    console.error('Request Error:', error.message);
  }

  throw new Error(errorMessage);
};

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  config => {
    // You can add auth headers or other request modifications here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    // Handle 401 or other status codes here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;