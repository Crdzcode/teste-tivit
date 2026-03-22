import { apiRequest } from './client';
import { ENDPOINTS } from '../constants';
import { AdminData } from '../types';

export async function getAdminData(): Promise<AdminData> {
  const response = await apiRequest(ENDPOINTS.ADMIN);

  if (!response.ok) {
    throw new Error('Failed to fetch admin data');
  }

  return response.json();
}