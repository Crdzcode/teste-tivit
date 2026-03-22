import { apiRequest } from './client';
import { ENDPOINTS } from '../constants';
import { UserData } from '../types';

export async function getUserData(): Promise<UserData> {
  const response = await apiRequest(ENDPOINTS.USER);

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  return data;
}