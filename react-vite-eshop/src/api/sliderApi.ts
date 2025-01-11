// src/api/sliderApi.ts
import apiClient from './apiClient';
import { Slider } from '../types/types';

const getAllSliders = async (): Promise<Slider[]> => {
  const response = await apiClient.get('/sliders');
  return response.data;
};

const createSlider = async (slider: Partial<Slider>): Promise<Slider> => {
  const response = await apiClient.post('/sliders', slider);
  return response.data;
};

const updateSlider = async (id: number, slider: Partial<Slider>): Promise<Slider> => {
  const response = await apiClient.put(`/sliders/${id}`, slider);
  return response.data;
};

const deleteSlider = async (id: number): Promise<void> => {
  await apiClient.delete(`/sliders/${id}`);
};

const uploadImage = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
  
    const response = await apiClient.post('/sliders/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  
    return response.data;
  };

export default {
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  uploadImage,
};
