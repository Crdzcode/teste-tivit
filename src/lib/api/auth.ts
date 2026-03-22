import { apiRequest } from './client';
import { ENDPOINTS } from '../constants';
import { LoginRequest, AuthResponse, AuthApiResponse } from '../types';

export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  const query = new URLSearchParams({
    username: credentials.username,
    password: credentials.password,
  });
  const endpoint = `${ENDPOINTS.TOKEN}?${query.toString()}`;
  const response = await apiRequest(endpoint, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data: AuthApiResponse = await response.json();

  if (!data.access_token) {
    throw new Error('Token not received from API');
  }

  let role: 'user' | 'admin' = 'user';
  try {
    const payload = data.access_token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    role = decodedPayload.sub as 'user' | 'admin';
  } catch {
    role = 'user';
  }

  return { token: data.access_token, role };
}