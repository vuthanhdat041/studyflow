import axios from "axios";

// Dùng biến môi trường nếu có, fallback localhost:5000
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});
