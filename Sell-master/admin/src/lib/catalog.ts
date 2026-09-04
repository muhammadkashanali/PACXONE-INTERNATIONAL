import { api, uploadAdminFile } from './api';

export async function uploadProductImage(file: File) {
  return (await uploadAdminFile(file)).secure_url;
}

export async function uploadProductDatasheet(file: File) {
  return (await uploadAdminFile(file)).secure_url;
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
