export interface Category {
  id: string;
  _id?: string;
  slug?: string;
  name: string;
  description: string;
  image: string;
  parentCategory?: string | null;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  model: string;
  categoryId: string;
  description: string;
  image: string;
  datasheet?: string;
  features: string[];
  applications: string[];
  specs: { label: string; value: string }[];
  availability: "In Stock" | "On Order" | "Limited";
  featured?: boolean;
}
