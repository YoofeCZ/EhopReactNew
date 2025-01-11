import apiClient from './apiClient';
import { Product } from '../types/types';

const getAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data;
};

const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  };
  

const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await apiClient.post('/products', product);
  return response.data;
};

const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  };

const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products/featured');
  return response.data;
};

const getRandomProduct = async (): Promise<Product> => {
  const response = await apiClient.get('/products/random');
  return response.data;
};

const getRandomProducts = async (
    count: number,
    excludeIds: number[] = []
  ): Promise<Product[]> => {
    // Definice typu params
    const params: { count: number; excludeIds?: string } = { count };
    if (excludeIds.length > 0) {
      params.excludeIds = excludeIds.join(',');
    }
  
    const response = await apiClient.get('/products/random', { params });
    return response.data;
  };

// Nová metoda pro získání nejnovějších produktů
const getLatestProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products/latest');
  return response.data;
};
  

export default {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getRandomProduct,
  updateProduct,
  getRandomProducts,
  getLatestProducts,
};
