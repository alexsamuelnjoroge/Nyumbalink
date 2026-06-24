const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function post<T>(path: string, body?: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method:      'POST',
    credentials: 'include',  // send/receive HttpOnly cookies
    headers: {
      'Content-Type':  'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((json as { message?: string }).message ?? `Error ${res.status}`);
  }

  return (json as { data: T }).data;
}

export interface AuthUser {
  id:          string;
  fullName:    string;
  phoneNumber: string;
  role:        string;
}

export interface AuthResponse {
  user:        AuthUser;
  accessToken: string;
}

export function requestOTP(phone: string): Promise<void> {
  return post('/auth/request-otp', { phone });
}

export function verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/verify-otp', { phone, otp });
}

export function refreshToken(): Promise<{ accessToken: string }> {
  return post<{ accessToken: string }>('/auth/refresh');
}

export function logout(token?: string): Promise<void> {
  return post('/auth/logout', undefined, token);
}
