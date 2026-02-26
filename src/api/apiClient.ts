import axios from "axios";

const apiBaseUrl = "http://localhost:4000";

// Axios instance
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    "Referrer-Policy": "no-referrer",
  },
});

export default apiClient;
