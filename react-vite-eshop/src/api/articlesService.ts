// src/api/articlesService.ts
import apiClient from './apiClient';
import { Article } from '../types/types';

const getArticles = async (): Promise<Article[]> => {
  const response = await apiClient.get<Article[]>('/articles');
  return response.data;
};

const getArticleById = async (id: number): Promise<Article> => {
  const response = await apiClient.get<Article>(`/articles/${id}`);
  return response.data;
};

const createArticle = async (article: Partial<Article>): Promise<Article> => {
  const response = await apiClient.post('/articles', article);
  return response.data;
};

const updateArticle = async (id: number, article: Partial<Article>): Promise<Article> => {
  const response = await apiClient.put(`/articles/${id}`, article);
  return response.data;
};

const deleteArticle = async (id: number): Promise<void> => {
  await apiClient.delete(`/articles/${id}`);
};

export { getArticles, getArticleById };
export default {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
