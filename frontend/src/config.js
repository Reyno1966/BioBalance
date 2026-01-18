const rawUrl = import.meta.env.VITE_API_URL || 'https://backend-five-psi-62.vercel.app';
// Limpiar espacios y barra final si existe
const API_URL = rawUrl.trim().replace(/\/+$/, "");

export default API_URL;
