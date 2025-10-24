/**
 * API Client for connecting to the FastAPI backend
 * Base URL: http://localhost:8000/api/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Get the auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Make an HTTP request to the backend
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...requestOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(requestOptions.headers as Record<string, string> || {}),
  };

  // Add authorization header if token exists
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Auth API endpoints
 */
export const authAPI = {
  register: async (email: string, password: string, full_name: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
      skipAuth: true,
    }),

  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
      skipAuth: true,
    } as any);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  getMe: async () =>
    apiRequest('/auth/me'),
};

/**
 * Products API endpoints
 */
export const productsAPI = {
  getAll: async (skip: number = 0, limit: number = 100) =>
    apiRequest(`/products/?skip=${skip}&limit=${limit}`, { skipAuth: true }),

  getBySlug: async (slug: string) =>
    apiRequest(`/products/${slug}`, { skipAuth: true }),

  getCategories: async () =>
    apiRequest('/products/categories', { skipAuth: true }),
};

/**
 * Cart API endpoints
 */
export const cartAPI = {
  getCart: async () =>
    apiRequest('/cart/'),

  addItem: async (productId: string, quantity: number) =>
    apiRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    }),

  updateItem: async (itemId: string, quantity: number) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: async (itemId: string) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),
};

/**
 * Orders API endpoints
 */
export const ordersAPI = {
  checkout: async () =>
    apiRequest('/orders/checkout', { method: 'POST', body: '{}' }),

  getAll: async () =>
    apiRequest('/orders/'),

  getById: async (orderId: string) =>
    apiRequest(`/orders/${orderId}`),
};
