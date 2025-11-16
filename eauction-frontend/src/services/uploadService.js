import { apiClient, handleRequest } from './api';

export const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  return handleRequest(
    apiClient.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};
