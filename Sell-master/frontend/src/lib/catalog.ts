import { type Product as CatalogProduct, type Category } from "./products";
import { api } from "./api";

export type Product = CatalogProduct & {
  _id?: string;
  category?: { _id?: string; slug?: string; name?: string } | null;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchCategories(): Promise<Category[]> {
  const data = await api.get<any[]>("/categories");
  return (Array.isArray(data) ? data : []).map((item) => ({
    id: item.slug || item._id || item.id,
    _id: item._id,
    slug: item.slug || item._id || item.id,
    name: item.name,
    description: item.description,
    image: item.image || "",
    parentCategory: item.parentCategory ? String(item.parentCategory) : null,
  }));
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await api.get<any[]>("/products");
  return (Array.isArray(data) ? data : []).map((item) => ({
    id: item._id || item.id,
    slug: item.slug || item._id || item.id,
    name: item.name,
    brand: item.brand,
    model: item.model,
    categoryId: item.categoryId || item.category?.slug || item.category?.id || "",
    description: item.description,
    image: item.image || "",
    datasheet: item.datasheet || "",
    features: item.features || [],
    applications: item.applications || [],
    specs: item.specs || [],
    availability: item.availability || "In Stock",
    featured: Boolean(item.featured),
  }));
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  const data = await api.get<Product>(`/products/${id}`);
  return {
    id: data._id || data.id,
    name: data.name,
    brand: data.brand,
    model: data.model,
    categoryId: data.categoryId || data.category?.slug || "",
    description: data.description,
    image: data.image || "",
    datasheet: data.datasheet || "",
    features: data.features || [],
    applications: data.applications || [],
    specs: data.specs || [],
    availability: data.availability || "In Stock",
    featured: data.featured || false,
  };
}

export async function submitQuote(payload: Record<string, unknown>) {
  return api.post<{ message: string; quote: unknown }>("/quotes", payload);
}

export async function loginToAdmin(email: string, password: string) {
  return api.post<{ token: string; name: string; email: string; role: string }>("/auth/login", { email, password });
}

export async function fetchAdminQuotes() {
  return api.get<unknown[]>("/quotes");
}

export async function updateQuoteStatus(id: string, status: string) {
  return api.patch<unknown>(`/quotes/${id}/status`, { status });
}

export async function createProduct(payload: Record<string, unknown>) {
  return api.post<unknown>("/products", payload);
}

export async function updateProduct(id: string, payload: Record<string, unknown>) {
  return api.put<unknown>(`/products/${id}`, payload);
}

export async function deleteProduct(id: string) {
  return api.delete<unknown>(`/products/${id}`);
}

export async function fetchAdminProducts() {
  return api.get<unknown[]>("/products");
}
