import { api } from './api';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1';

export async function uploadProductImage(file: File) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Add the Cloudinary variables to admin/.env.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error?.message || 'Image upload failed');
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) throw new Error('Cloudinary did not return an image URL');

  return result.secure_url;
}

export async function loginToAdmin(email: string, password: string) {
  return api.post<{ token: string; name: string; email: string; role: string }>('/auth/login', { email, password });
}

export async function fetchCategories() {
  return api.get<any[]>('/categories');
}

export async function createCategory(payload: Record<string, unknown>) {
  return api.post<any>('/categories', payload);
}

export async function updateCategory(id: string, payload: Record<string, unknown>) {
  return api.put<any>(`/categories/${id}`, payload);
}

export async function deleteCategory(id: string) {
  return api.delete<any>(`/categories/${id}`);
}

export async function fetchAdminProducts() {
  return api.get<any[]>('/products');
}

export async function fetchAdminQuotes() {
  return api.get<any[]>('/quotes');
}

export async function createProduct(payload: Record<string, unknown>) {
  return api.post<any>('/products', payload);
}

export async function updateProduct(id: string, payload: Record<string, unknown>) {
  return api.put<any>(`/products/${id}`, payload);
}

export async function deleteProduct(id: string) {
  return api.delete<any>(`/products/${id}`);
}

export async function updateQuoteStatus(id: string, status: string) {
  return api.patch<any>(`/quotes/${id}/status`, { status });
}
