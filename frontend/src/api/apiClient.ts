import axios from 'axios';
import { SumDTO, CountDTO, DeleteResultDTO, LabWorkDTO } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(`API Error: ${message}`, {
      status: error.response?.status,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

export const fetchEntities = async <T>(path: string): Promise<T[]> => {
  const response = await apiClient.get<T[]>(path);
  return response.data;
};

export const fetchEntityById = async <T>(path: string, id: number, isFull: boolean = false): Promise<T> => {
  const url = isFull ? `${path}/${id}/full` : `${path}/${id}`;
  const response = await apiClient.get<T>(url);
  return response.data;
};

export const createEntity = async <T>(path: string, payload: any): Promise<T> => {
  const response = await apiClient.post<T>(path, payload);
  return response.data;
};

export const updateEntity = async <T>(path: string, id: number, payload: any): Promise<T> => {
  const response = await apiClient.put<T>(`${path}/${id}`, payload);
  return response.data;
};

export const deleteEntity = async (path: string, id: number): Promise<void> => {
  await apiClient.delete(`${path}/${id}`);
};

export const deleteAllByMinimalPoint = async (value: number): Promise<DeleteResultDTO> => {
  const response = await apiClient.delete(`/labworks/by-minimal-point/${value}`);
  return response.data;
};

export const getSumOfMinimalPoint = async (): Promise<SumDTO> => {
  const response = await apiClient.get('/labworks/minimal-point/sum');
  return response.data;
};

export const getCountByAuthorIdGreaterThan = async (authorId: number): Promise<CountDTO> => {
  const response = await apiClient.get(`/labworks/count/author-id-gt/${authorId}`);
  return response.data;
};

export const decreaseDifficulty = async (labWorkId: number, steps: number): Promise<LabWorkDTO> => {
  const response = await apiClient.post(`/labworks/${labWorkId}/decrease-difficulty?steps=${steps}`);
  return response.data;
};

export const assignTop10ToDiscipline = async (disciplineId: number): Promise<LabWorkDTO[]> => {
  const response = await apiClient.post(`/labworks/assign-top10-hardest-to-discipline/${disciplineId}`);
  return response.data;
};