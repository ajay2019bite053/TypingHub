import { api, API_BASE_URL } from '../utils/api';
import { API_CONFIG } from '../config/api';

// Helper function to add auth token to requests
const addAuthToken = (options: any = {}) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return options;
};

// Helper function to handle token refresh
const handleTokenRefresh = async () => {
      try {
    const response = await fetch(`${API_BASE_URL}/api${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      const { accessToken } = await response.json();
        localStorage.setItem('accessToken', accessToken);
      return accessToken;
    }
  } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    throw error;
  }
};

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  register: async (userData: any) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  },

  logout: async () => {
    await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

export const passageService = {
  getAll: async () => {
    const options = addAuthToken();
    const response = await api.get(API_CONFIG.ENDPOINTS.PASSAGES.BASE, options);
    return response;
  },

  getByTest: async (testType: string) => {
    const options = addAuthToken();
    const response = await api.get(API_CONFIG.ENDPOINTS.PASSAGES.BY_TEST(testType), options);
    return response;
  },

  getById: async (id: string) => {
    const options = addAuthToken();
    const response = await api.get(API_CONFIG.ENDPOINTS.PASSAGES.BY_ID(id), options);
    return response;
  }
};

export const adminService = {
  getRequests: async () => {
    const options = addAuthToken();
    const response = await api.get(API_CONFIG.ENDPOINTS.ADMIN.REQUESTS, options);
    return response;
  },

  approveRequest: async (id: string) => {
    const options = addAuthToken();
    const response = await api.put(API_CONFIG.ENDPOINTS.ADMIN.APPROVE(id), {}, options);
    return response;
  },

  rejectRequest: async (id: string) => {
    const options = addAuthToken();
    const response = await api.put(API_CONFIG.ENDPOINTS.ADMIN.REJECT(id), {}, options);
    return response;
  }
};

export const deleteRequestService = {
  getAll: async () => {
    const options = addAuthToken();
    const response = await api.get(API_CONFIG.ENDPOINTS.DELETE_REQUESTS.BASE, options);
    return response;
  },

  create: async (request: any) => {
    const options = addAuthToken();
    const response = await api.post(API_CONFIG.ENDPOINTS.DELETE_REQUESTS.BASE, request, options);
    return response;
  },

  approve: async (id: string) => {
    const options = addAuthToken();
    const response = await api.put(API_CONFIG.ENDPOINTS.DELETE_REQUESTS.BY_ID(id), { status: 'approved' }, options);
    return response;
  },

  reject: async (id: string) => {
    const options = addAuthToken();
    const response = await api.put(API_CONFIG.ENDPOINTS.DELETE_REQUESTS.BY_ID(id), { status: 'rejected' }, options);
    return response;
  }
};

// Product API functions
export const productAPI = {
	// Get all products with search, filter, and sort
	getAllProducts: async (params?: {
		search?: string;
		category?: string;
		vendor?: string;
		sortBy?: string;
		sortOrder?: string;
		minPrice?: number;
		maxPrice?: number;
		page?: number;
		limit?: number;
	}) => {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, value.toString());
				}
			});
		}
		
		const response = await fetch(`${API_BASE_URL}/api/products?${queryParams}`);
		if (!response.ok) throw new Error('Failed to fetch products');
		return response.json();
	},

	// Get product by slug
	getProductBySlug: async (slug: string) => {
		const response = await fetch(`${API_BASE_URL}/api/products/slug/${slug}`);
		if (!response.ok) throw new Error('Product not found');
		return response.json();
	},

	// Get products by category
	getProductsByCategory: async (category: string, page = 1, limit = 20) => {
		const response = await fetch(`${API_BASE_URL}/api/products/category/${category}?page=${page}&limit=${limit}`);
		if (!response.ok) throw new Error('Failed to fetch products');
		return response.json();
	},

	// Get categories with product counts
	getCategories: async () => {
		const response = await fetch(`${API_BASE_URL}/api/products/categories`);
		if (!response.ok) throw new Error('Failed to fetch categories');
		return response.json();
	},

	// Admin functions (require authentication)
	createProduct: async (productData: any, token: string) => {
		const response = await fetch(`${API_BASE_URL}/api/products`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(productData)
		});
		if (!response.ok) throw new Error('Failed to create product');
		return response.json();
	},

	updateProduct: async (id: string, productData: any, token: string) => {
		const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(productData)
		});
		if (!response.ok) throw new Error('Failed to update product');
		return response.json();
	},

	deleteProduct: async (id: string, token: string) => {
		const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (!response.ok) throw new Error('Failed to delete product');
		return response.json();
	},

	bulkCreateProducts: async (products: any[], token: string) => {
		const response = await fetch(`${API_BASE_URL}/api/products/bulk`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ products })
		});
		if (!response.ok) throw new Error('Failed to create products');
		return response.json();
	}
};

export default api; 