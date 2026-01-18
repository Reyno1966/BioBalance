const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Limpiar espacios y barra final si existe
const API_URL = rawUrl.trim().replace(/\/+$/, "");

export default API_URL;
