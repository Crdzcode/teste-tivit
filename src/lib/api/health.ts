import { apiRequest } from './client';
import { ENDPOINTS } from '../constants';
import { HealthResponse } from '../types';

export async function getHealth(): Promise<HealthResponse> {
  const response = await apiRequest(ENDPOINTS.HEALTH);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}