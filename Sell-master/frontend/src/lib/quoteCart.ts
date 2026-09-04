import type { Product } from "./products";

const STORAGE_KEY = "pacxone-quote-cart";

export type QuoteCartItem = Pick<Product, "id" | "name" | "brand" | "model" | "image">;

export function getQuoteCart(): QuoteCartItem[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const items = stored ? JSON.parse(stored) : [];
        return Array.isArray(items) ? items : [];
    } catch {
        return [];
    }
}

function saveQuoteCart(items: QuoteCartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("quote-cart-updated"));
}

export function addToQuoteCart(product: Product) {
    const items = getQuoteCart();
    if (items.some((item) => item.id === product.id)) return;

    saveQuoteCart([
        ...items,
        {
            id: product.id,
            name: product.name,
            brand: product.brand,
            model: product.model,
            image: product.image,
        },
    ]);
}

export function removeFromQuoteCart(id: string) {
    saveQuoteCart(getQuoteCart().filter((item) => item.id !== id));
}

export function clearQuoteCart() {
    saveQuoteCart([]);
}
