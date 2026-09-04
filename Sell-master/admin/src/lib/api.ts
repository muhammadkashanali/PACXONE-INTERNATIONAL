export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('pacxone-token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = 'Request failed';

    try {
      const parsed = JSON.parse(errorText);
      message = parsed.message || message;
    } catch {
      message = errorText || message;
    }

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('pacxone-admin-user');
      localStorage.removeItem('pacxone-token');
      window.location.assign('/login');
    }

    throw new Error(message);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function uploadAdminFile(file: File) {
  const token = localStorage.getItem('pacxone-token');
  const body = new FormData();
  body.append('file', file);

  const response = await fetch(`${API_BASE_URL}/uploads/product-file`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'File upload failed');
  return result as { secure_url: string };
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
