import { API_BASE_URL } from '../constants';
import { getTokenFromCookie } from '../utils';

export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getTokenFromCookie();
  const authorization = token ? `Bearer ${token}` : undefined;
  const headers = {
    'Content-Type': 'application/json',
    ...(authorization && { Authorization: authorization }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}