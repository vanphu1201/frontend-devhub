/**
 * API Service Layer for CodeConnect Hub
 * Replaces Supabase with Node.js/Express + MongoDB backend
 * 
 * Base URL: http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================================================
// REQUEST HELPERS
// ============================================================================

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}

const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

const getHeaders = (includeAuth = true): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

async function apiCall<T>(
    endpoint: string,
    options: RequestInit & { requiresAuth?: boolean } = {}
): Promise<ApiResponse<T>> {
    const { requiresAuth = false, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    const finalOptions: RequestInit = {
        ...fetchOptions,
        headers: {
            ...getHeaders(requiresAuth),
            ...((fetchOptions.headers as Record<string, string>) || {}),
        },
    };

    try {
        const response = await fetch(url, finalOptions);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { error: response.statusText };
            }
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const authService = {
    async signup(email: string, password: string, displayName: string) {
        const response = await apiCall<{ id: string; token: string }>(
            '/auth/signup',
            {
                method: 'POST',
                body: JSON.stringify({ email, password, displayName }),
            }
        );

        if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response;
    },

    async login(email: string, password: string) {
        const response = await apiCall<{ id: string; token: string }>(
            '/auth/login',
            {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }
        );

        if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response;
    },

    async loginWithGithub(code: string) {
        const response = await apiCall<{ id: string; token: string }>(
            '/auth/login/github',
            {
                method: 'POST',
                body: JSON.stringify({ code }),
            }
        );

        if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response;
    },

    async loginWithGoogle(code: string) {
        const response = await apiCall<{ id: string; token: string }>(
            '/auth/login/google',
            {
                method: 'POST',
                body: JSON.stringify({ code }),
            }
        );

        if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response;
    },

    async forgotPassword(email: string) {
        return apiCall('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword(token: string, newPassword: string) {
        return apiCall('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
    },

    async updatePassword(currentPassword: string, newPassword: string) {
        return apiCall(
            '/auth/update-password',
            {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword }),
                requiresAuth: true,
            }
        );
    },

    logout() {
        localStorage.removeItem('authToken');
    },
};

// ============================================================================
// USER PROFILES
// ============================================================================

export const userService = {
    async getProfile(userId: string) {
        return apiCall(`/users/${userId}`);
    },

    async getProfileByUsername(username: string) {
        return apiCall(`/users/username/${username}`);
    },

    async updateProfile(data: {
        displayName?: string;
        username?: string;
        bio?: string;
        skills?: string[];
    }) {
        return apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/users/avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then((res) => res.json());
    },

    async uploadCover(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/users/cover`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then((res) => res.json());
    },

    async followUser(userId: string) {
        return apiCall(`/users/${userId}/follow`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unfollowUser(userId: string) {
        return apiCall(`/users/${userId}/follow`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async isFollowing(userId: string) {
        return apiCall(`/users/${userId}/is-following`, {
            requiresAuth: true,
        });
    },

    async getLeaderboard(limit = 50, offset = 0) {
        return apiCall(
            `/leaderboard?limit=${limit}&offset=${offset}`
        );
    },
};

// ============================================================================
// SOCIAL FEED / POSTS
// ============================================================================

export const postService = {
    async getPosts(
        filter: 'trending' | 'latest' | 'following' = 'trending',
        limit = 20,
        offset = 0,
        search = ''
    ) {
        let url = `/posts?filter=${filter}&limit=${limit}&offset=${offset}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return apiCall(url, { requiresAuth: true });
    },

    async getPost(postId: string) {
        return apiCall(`/posts/${postId}`);
    },

    async getUserPosts(userId: string, limit = 20, offset = 0) {
        return apiCall(`/users/${userId}/posts?limit=${limit}&offset=${offset}`);
    },

    async createPost(content: string, images: string[] = []) {
        return apiCall('/posts', {
            method: 'POST',
            body: JSON.stringify({ content, images }),
            requiresAuth: true,
        });
    },

    async deletePost(postId: string) {
        return apiCall(`/posts/${postId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async uploadPostImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/posts/upload-image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then((res) => res.json());
    },

    async likePost(postId: string) {
        return apiCall(`/posts/${postId}/like`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unlikePost(postId: string) {
        return apiCall(`/posts/${postId}/like`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async isPostLiked(postId: string) {
        return apiCall(`/posts/${postId}/is-liked`, {
            requiresAuth: true,
        });
    },

    async bookmarkPost(postId: string) {
        return apiCall(`/posts/${postId}/bookmark`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unbookmarkPost(postId: string) {
        return apiCall(`/posts/${postId}/bookmark`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async isPostBookmarked(postId: string) {
        return apiCall(`/posts/${postId}/is-bookmarked`, {
            requiresAuth: true,
        });
    },

    async getPostComments(postId: string, limit = 20, offset = 0) {
        return apiCall(
            `/posts/${postId}/comments?limit=${limit}&offset=${offset}`
        );
    },

    async createPostComment(postId: string, content: string, images: string[] = []) {
        return apiCall(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, images }),
            requiresAuth: true,
        });
    },

    async deletePostComment(postId: string, commentId: string) {
        return apiCall(`/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async likePostComment(postId: string, commentId: string) {
        return apiCall(`/posts/${postId}/comments/${commentId}/like`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unlikePostComment(postId: string, commentId: string) {
        return apiCall(`/posts/${postId}/comments/${commentId}/like`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async isPostCommentLiked(postId: string, commentId: string) {
        return apiCall(`/posts/${postId}/comments/${commentId}/is-liked`, {
            requiresAuth: true,
        });
    },
};

// ============================================================================
// BLOG / ARTICLES
// ============================================================================

export const blogService = {
    async getBlogPosts(
        category = '',
        sortBy: 'latest' | 'trending' | 'mostLiked' = 'latest',
        limit = 20,
        offset = 0,
        search = ''
    ) {
        let url = `/blog/posts?sortBy=${sortBy}&limit=${limit}&offset=${offset}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return apiCall(url);
    },

    async getBlogPost(idOrSlug: string) {
        return apiCall(`/blog/posts/${idOrSlug}`);
    },

    async getAdminBlogPosts(
        status: 'draft' | 'pending' | 'approved' | 'rejected' = 'draft',
        limit = 20,
        offset = 0
    ) {
        return apiCall(
            `/blog/admin/posts?status=${status}&limit=${limit}&offset=${offset}`,
            { requiresAuth: true }
        );
    },

    async getUserBlogPosts(userId: string, limit = 20, offset = 0) {
        return apiCall(`/users/${userId}/blog/posts?limit=${limit}&offset=${offset}`);
    },

    async createBlogPost(data: {
        title: string;
        content: string;
        excerpt: string;
        category: string;
        tags: string[];
        image?: string;
    }) {
        return apiCall('/blog/posts', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async updateBlogPost(
        postId: string,
        data: {
            title?: string;
            content?: string;
            excerpt?: string;
            category?: string;
            tags?: string[];
            image?: string;
        }
    ) {
        return apiCall(`/blog/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async deleteBlogPost(postId: string) {
        return apiCall(`/blog/posts/${postId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async approveBlogPost(postId: string, approved: boolean) {
        return apiCall(
            `/blog/admin/posts/${postId}/approve`,
            {
                method: 'POST',
                body: JSON.stringify({ approved }),
                requiresAuth: true,
            }
        );
    },

    async likeBlogPost(postId: string) {
        return apiCall(`/blog/posts/${postId}/like`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unlikeBlogPost(postId: string) {
        return apiCall(`/blog/posts/${postId}/like`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async isBlogPostLiked(postId: string) {
        return apiCall(`/blog/posts/${postId}/is-liked`, {
            requiresAuth: true,
        });
    },

    async bookmarkBlogPost(postId: string) {
        return apiCall(`/blog/posts/${postId}/bookmark`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unbookmarkBlogPost(postId: string) {
        return apiCall(`/blog/posts/${postId}/bookmark`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async isBlogPostBookmarked(postId: string) {
        return apiCall(`/blog/posts/${postId}/is-bookmarked`, {
            requiresAuth: true,
        });
    },

    async incrementBlogPostView(postId: string) {
        return apiCall(`/blog/posts/${postId}/view`, {
            method: 'POST',
        });
    },

    async getBlogPostComments(postId: string, limit = 20, offset = 0) {
        return apiCall(
            `/blog/posts/${postId}/comments?limit=${limit}&offset=${offset}`
        );
    },

    async createBlogPostComment(
        postId: string,
        content: string,
        images: string[] = []
    ) {
        return apiCall(`/blog/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, images }),
            requiresAuth: true,
        });
    },

    async deleteBlogPostComment(postId: string, commentId: string) {
        return apiCall(`/blog/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async likeBlogPostComment(postId: string, commentId: string) {
        return apiCall(`/blog/posts/${postId}/comments/${commentId}/like`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async unlikeBlogPostComment(postId: string, commentId: string) {
        return apiCall(`/blog/posts/${postId}/comments/${commentId}/like`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    // Series endpoints
    async getSeries(limit = 20, offset = 0, search = '') {
        let url = `/blog/series?limit=${limit}&offset=${offset}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return apiCall(url);
    },

    async getSeriesDetail(idOrSlug: string) {
        return apiCall(`/blog/series/${idOrSlug}`);
    },

    async getAdminSeries() {
        return apiCall('/blog/admin/series', { requiresAuth: true });
    },

    async getUserSeries(userId: string) {
        return apiCall(`/users/${userId}/blog/series`);
    },

    async createSeries(data: {
        title: string;
        description: string;
        image?: string;
    }) {
        return apiCall('/blog/series', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async updateSeries(
        seriesId: string,
        data: {
            title?: string;
            description?: string;
            image?: string;
        }
    ) {
        return apiCall(`/blog/series/${seriesId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async deleteSeries(seriesId: string) {
        return apiCall(`/blog/series/${seriesId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async approveSeries(seriesId: string, approved: boolean) {
        return apiCall(
            `/blog/admin/series/${seriesId}/approve`,
            {
                method: 'POST',
                body: JSON.stringify({ approved }),
                requiresAuth: true,
            }
        );
    },
};

// ============================================================================
// MARKETPLACE / PRODUCTS
// ============================================================================

export const productService = {
    async getProducts(
        category = '',
        limit = 20,
        offset = 0,
        sort: 'latest' | 'trending' | 'mostSold' = 'latest',
        search = ''
    ) {
        let url = `/products?sort=${sort}&limit=${limit}&offset=${offset}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return apiCall(url);
    },

    async getFeaturedProducts() {
        return apiCall('/products/featured');
    },

    async getProduct(productId: string) {
        return apiCall(`/products/${productId}`);
    },

    async getUserProducts(userId: string) {
        return apiCall(`/users/${userId}/products`);
    },

    async getUserPurchases() {
        return apiCall('/users/purchases', { requiresAuth: true });
    },

    async hasPurchased(productId: string) {
        return apiCall(`/products/${productId}/has-purchased`, {
            requiresAuth: true,
        });
    },

    async purchaseProduct(productId: string, paymentMethodId: string) {
        return apiCall(`/products/${productId}/purchase`, {
            method: 'POST',
            body: JSON.stringify({ paymentMethodId }),
            requiresAuth: true,
        });
    },

    async createProduct(data: {
        title: string;
        description: string;
        image: string;
        price: number;
        currency: string;
        category: string;
        tags: string[];
        downloadUrl: string;
        preview?: string;
    }) {
        return apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async updateProduct(
        productId: string,
        data: Partial<{
            title: string;
            description: string;
            image: string;
            price: number;
            currency: string;
            category: string;
            tags: string[];
            downloadUrl: string;
            preview: string;
        }>
    ) {
        return apiCall(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async deleteProduct(productId: string) {
        return apiCall(`/products/${productId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },

    async getAdminProducts() {
        return apiCall('/products/admin/all', { requiresAuth: true });
    },

    async getProductReviews(productId: string, limit = 20, offset = 0) {
        return apiCall(
            `/products/${productId}/reviews?limit=${limit}&offset=${offset}`
        );
    },

    async addProductReview(productId: string, rating: number, content: string) {
        return apiCall(`/products/${productId}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, content }),
            requiresAuth: true,
        });
    },
};

// ============================================================================
// SUPPORT TICKETS
// ============================================================================

export const ticketService = {
    async getUserTickets(
        status: 'open' | 'closed' | 'resolved' = 'open',
        limit = 20,
        offset = 0
    ) {
        return apiCall(
            `/tickets?status=${status}&limit=${limit}&offset=${offset}`,
            { requiresAuth: true }
        );
    },

    async getTicket(ticketId: string) {
        return apiCall(`/tickets/${ticketId}`, { requiresAuth: true });
    },

    async getTicketMessages(ticketId: string) {
        return apiCall(`/tickets/${ticketId}/messages`, {
            requiresAuth: true,
        });
    },

    async createTicket(data: {
        subject: string;
        description: string;
        productId?: string;
        priority: 'low' | 'medium' | 'high';
    }) {
        return apiCall('/tickets', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async addTicketMessage(ticketId: string, content: string) {
        return apiCall(`/tickets/${ticketId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content }),
            requiresAuth: true,
        });
    },

    async getAdminTickets() {
        return apiCall('/tickets/admin/all', { requiresAuth: true });
    },

    async updateTicketStatus(
        ticketId: string,
        status: 'open' | 'resolved' | 'closed'
    ) {
        return apiCall(`/tickets/${ticketId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
            requiresAuth: true,
        });
    },
};

// ============================================================================
// LEARNING RESOURCES
// ============================================================================

export const resourceService = {
    async getResources(
        filter: 'all' | 'free' | 'premium' = 'all',
        limit = 20,
        offset = 0,
        search = ''
    ) {
        let url = `/resources?filter=${filter}&limit=${limit}&offset=${offset}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return apiCall(url);
    },

    async getAdminResources() {
        return apiCall('/resources/admin/all', { requiresAuth: true });
    },

    async getResource(resourceId: string) {
        return apiCall(`/resources/${resourceId}`);
    },

    async getUserResourcePurchases() {
        return apiCall('/users/resources/purchases', {
            requiresAuth: true,
        });
    },

    async unlockResource(resourceId: string) {
        return apiCall(`/resources/${resourceId}/unlock`, {
            method: 'POST',
            requiresAuth: true,
        });
    },

    async createResource(file: File, data: {
        title: string;
        type: 'pdf' | 'code' | 'image' | 'video';
        description: string;
        isPremium: boolean;
    }) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', data.title);
        formData.append('type', data.type);
        formData.append('description', data.description);
        formData.append('isPremium', String(data.isPremium));

        return fetch(`${API_BASE_URL}/resources`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            body: formData,
        }).then((res) => res.json());
    },

    async updateResource(
        resourceId: string,
        data: {
            title?: string;
            description?: string;
            isPremium?: boolean;
        }
    ) {
        return apiCall(`/resources/${resourceId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth: true,
        });
    },

    async deleteResource(resourceId: string) {
        return apiCall(`/resources/${resourceId}`, {
            method: 'DELETE',
            requiresAuth: true,
        });
    },
};

// ============================================================================
// GAMIFICATION / BADGES
// ============================================================================

export const badgeService = {
    async getUserBadges(userId: string) {
        return apiCall(`/users/${userId}/badges`);
    },
};

// ============================================================================
// STATISTICS
// ============================================================================

export const statsService = {
    async getUserStats() {
        return apiCall('/stats/user', { requiresAuth: true });
    },
};

// ============================================================================
// SEARCH
// ============================================================================

export const searchService = {
    async search(
        query: string,
        type: 'all' | 'posts' | 'blogs' | 'products' | 'users' = 'all',
        limit = 10
    ) {
        return apiCall(
            `/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`
        );
    },
};

// ============================================================================
// HELPER EXPORTS
// ============================================================================

export const api = {
    auth: authService,
    user: userService,
    post: postService,
    blog: blogService,
    product: productService,
    ticket: ticketService,
    resource: resourceService,
    badge: badgeService,
    stats: statsService,
    search: searchService,
};

export default api;
