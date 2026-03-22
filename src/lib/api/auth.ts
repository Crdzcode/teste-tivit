import { apiRequest } from './client';
import { ENDPOINTS } from '../constants';
import { LoginRequest, AuthResponse, AuthApiResponse } from '../types';

const FALLBACK_SESSION_TTL_MS = 1000 * 60 * 60 * 24;

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
  let expiresAt = Date.now() + FALLBACK_SESSION_TTL_MS;
  let tokenExp: number | null = null;

  try {
    const payload = data.access_token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload)) as {
      sub?: 'user' | 'admin';
      exp?: number;
    };

    role = decodedPayload.sub as 'user' | 'admin';

    if (typeof decodedPayload.exp === 'number') {
      tokenExp = decodedPayload.exp;
      expiresAt = decodedPayload.exp * 1000;
    }
  } catch {
    role = 'user';
  }

  if (expiresAt <= Date.now()) {
    throw new Error('Token already expired');
  }

  return { token: data.access_token, role, expiresAt };
}