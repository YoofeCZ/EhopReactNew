import axios from 'axios';

// Dynamické nastavení baseURL na základě prostředí
const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api' // Pro vývoj
    : 'http://static-ip-volitelné/api'; // Pro produkci

// Vytvoření instance Axios s nastavenou baseURL
const apiClient = axios.create({
  baseURL, // Dynamická základní URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Přidání interceptoru pro chytání chyb
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Zpracování chyb
    return Promise.reject(error);
  }
);

export default apiClient;
