// src/api/categoryApi.ts
import { AxiosResponse } from 'axios';
import type { Dayjs } from 'dayjs';
import apiClient from './apiClient';
import { Category, Product } from '../types/types';

interface ProductFiltersParams {
  minPrice: number;
  maxPrice: number;
  sortBy: SortBy;
  startDate?: string;
  endDate?: string;
}

export enum SortBy {
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  PurchaseCountDesc = 'purchaseCount_desc',
  CreatedAtDesc = 'createdAt_desc',
}

const getAllCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};

const getProductsByCategoryWithFilters = async (
  id: number,
  priceRange: [number, number],
  dateRange: [Dayjs, Dayjs] | null,
  sortBy: SortBy
): Promise<Product[]> => {
  const params: ProductFiltersParams = {
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy,
  };
  if (dateRange) {
    params.startDate = dateRange[0].format('YYYY-MM-DD');
    params.endDate = dateRange[1].format('YYYY-MM-DD');
  }
  const response: AxiosResponse<Product[]> = await apiClient.get(`/categories/${id}/products`, { params });
  return response.data;
};

const getCategoryById = async (id: number): Promise<Category> => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

const getProductsByCategory = async (id: number): Promise<Product[]> => {
  const response = await apiClient.get(`/categories/${id}/products`);
  return response.data;
};

const createCategory = async (category: Partial<Category>): Promise<Category> => {
  const response = await apiClient.post('/categories', category);
  return response.data;
};

const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const response = await apiClient.put(`/categories/${id}`, category);
  return response.data;
};

const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

export default {
  getAllCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategoryWithFilters,
};
