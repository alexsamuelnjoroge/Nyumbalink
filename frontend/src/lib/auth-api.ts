const IS_MOCK  = process.env.NEXT_PUBLIC_MOCK === 'true';
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

// ── Mock auth ────────────────────────────────────────────────────────────────
// When NEXT_PUBLIC_MOCK=true:
//   - requestOTP always succeeds (no SMS sent)
//   - verifyOTP accepts "123456" as a valid code
//   - logout is a no-op

const MOCK_USER: AuthUser = {
  id:          'mock-user-1',
  fullName:    'Alex Njoroge',
  phoneNumber: '+254712345678',
  role:        'AGENT',
};

function delay(ms = 800) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function requestOTP(phone: string): Promise<void> {
  if (IS_MOCK) { await delay(); return; }
  return post('/auth/request-otp', { phone });
}

export async function verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
  if (IS_MOCK) {
    await delay();
    if (otp !== '123456') throw new Error('Incorrect code. Use 123456 in mock mode.');
    return { user: { ...MOCK_USER, phoneNumber: phone }, accessToken: 'mock-access-token' };
  }
  return post<AuthResponse>('/auth/verify-otp', { phone, otp });
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  if (IS_MOCK) return { accessToken: 'mock-access-token' };
  return post<{ accessToken: string }>('/auth/refresh');
}

export async function logout(token?: string): Promise<void> {
  if (IS_MOCK) { await delay(400); return; }
  return post('/auth/logout', undefined, token);
}
