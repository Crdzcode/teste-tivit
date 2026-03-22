export interface AuthApiResponse {
  access_token: string;
  token_type: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}

export interface Purchase {
  id: number;
  item: string;
  price: number;
}

export interface Report {
  id: number;
  title: string;
  status: string;
}

export interface UserData {
  message: string;
  data: {
    name: string;
    email: string;
    purchases: Purchase[];
  };
}

export interface AdminData {
  message: string;
  data: {
    name: string;
    email: string;
    reports: Report[];
  };
}