// src/api/orderApi.ts
import apiClient from './apiClient';
import { Order } from '../types/types';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface CreateOrderPayload {
  userId: number;
  items: OrderItem[];
  total: number;
}

const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await apiClient.post('/orders', payload);
  return response.data;
};

export default {
  createOrder,
};
