import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  long_description: string | null;
  category: string | null;
  price: number;
  original_price: number | null;
  tech_stack: string[];
  preview_images: string[];
  demo_url: string | null;
  documentation_url: string | null;
  download_url: string | null;
  version: string;
  support_duration: string;
  rating: number;
  reviews_count: number;
  downloads_count: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    reputation: number;
  };
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  price_paid: number;
  download_count: number;
  purchased_at: string;
  product?: Product;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

const mapProduct = (p: any): Product => {
  return {
    id: p.id || p._id,
    user_id: p.author?.id || p.author || "",
    name: p.title || "",
    description: p.description || "",
    long_description: p.longDescription || null,
    category: p.category || null,
    price: p.price || 0,
    original_price: p.originalPrice || null,
    tech_stack: p.techStack || [],
    preview_images: p.previewImages || (p.image ? [p.image] : []),
    demo_url: p.demoUrl || null,
    documentation_url: p.documentationUrl || null,
    download_url: p.downloadUrl || null,
    version: p.version || "1.0.0",
    support_duration: p.supportDuration || "6 tháng",
    rating: p.rating || 0,
    reviews_count: p.reviewsCount || 0,
    downloads_count: p.sales || p.downloads || 0,
    is_featured: p.isFeatured || false,
    is_published: p.status === 'approved' || p.isPublished || true,
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: p.updatedAt || new Date().toISOString(),
    author: p.author ? {
      id: p.author.id || p.author._id || "",
      username: p.author.username || "",
      display_name: p.author.displayName || "",
      avatar_url: p.author.avatar || null,
      reputation: p.author.reputation || 0
    } : undefined
  };
};

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const res = await api.product.getProducts(category === 'all' ? '' : category, 20, 0, 'latest');
      if (!res.success) throw new Error(res.error || "Failed to fetch products");

      return (res.data?.items || []).map(mapProduct);
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await api.product.getFeaturedProducts();
      if (!res.success) throw new Error(res.error || "Failed to fetch featured products");

      return (res.data || []).map(mapProduct);
    },
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      const res = await api.product.getProduct(productId);
      if (!res.success) throw new Error(res.error || "Failed to fetch product");

      return mapProduct(res.data);
    },
    enabled: !!productId,
  });
};

export const useUserProducts = (userId: string) => {
  return useQuery({
    queryKey: ['products', 'user', userId],
    queryFn: async () => {
      const res = await api.product.getUserProducts(userId);
      if (!res.success) throw new Error(res.error || "Failed to fetch user products");

      return (res.data || []).map(mapProduct);
    },
    enabled: !!userId,
  });
};

export const useUserPurchases = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const res = await api.product.getUserPurchases();
      if (!res.success) throw new Error(res.error || "Failed to fetch user purchases");

      return (res.data || []).map((pur: any) => ({
        id: pur.id || pur._id,
        user_id: user.id,
        product_id: pur.product?.id || pur.product || "",
        price_paid: pur.pricePaid || 0,
        download_count: pur.downloadCount || 0,
        purchased_at: pur.createdAt || new Date().toISOString(),
        product: pur.product ? mapProduct(pur.product) : undefined
      })) as Purchase[];
    },
    enabled: !!user?.id,
  });
};

export const useHasPurchased = (productId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchases', 'check', productId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const res = await api.product.hasPurchased(productId);
      if (!res.success) return false;

      return !!res.data?.hasPurchased;
    },
    enabled: !!user?.id && !!productId,
  });
};

export const usePurchaseProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, price }: { productId: string; price: number }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.product.purchaseProduct(productId, "mock_stripe_token");
      if (!res.success) throw new Error(res.error || "Failed to purchase product");

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Mua sản phẩm thành công!');
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate') || error.message.includes('đã mua')) {
        toast.error('Bạn đã mua sản phẩm này rồi!');
      } else {
        toast.error('Lỗi mua hàng: ' + error.message);
      }
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: Partial<Product>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.product.createProduct({
        title: input.name!,
        description: input.description!,
        price: input.price || 0,
        currency: 'VND',
        category: input.category || 'Khác',
        tags: input.tech_stack || [],
        downloadUrl: input.download_url || '',
        image: input.preview_images?.[0] || '',
        preview: input.demo_url || undefined
      });

      if (!res.success) throw new Error(res.error || "Failed to create product");
      return mapProduct(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Tạo sản phẩm thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi tạo sản phẩm: ' + error.message);
    },
  });
};

export const useAdminProducts = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['products', 'admin'],
    queryFn: async () => {
      const res = await api.product.getAdminProducts();
      if (!res.success) throw new Error(res.error || "Failed to fetch admin products");

      return (res.data || []).map(mapProduct);
    },
    enabled: isAdmin,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const res = await api.product.updateProduct(id, {
        title: updates.name,
        description: updates.description,
        price: updates.price,
        tags: updates.tech_stack,
        downloadUrl: updates.download_url || undefined
      });

      if (!res.success) throw new Error(res.error || "Failed to update product");
      return mapProduct(res.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', data.id] });
      toast.success('Cập nhật sản phẩm thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.product.deleteProduct(productId);
      if (!res.success) throw new Error(res.error || "Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Đã xóa sản phẩm!');
    },
    onError: (error: any) => {
      toast.error('Lỗi xóa sản phẩm: ' + error.message);
    },
  });
};

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product_reviews', productId],
    queryFn: async () => {
      const res = await api.product.getProductReviews(productId, 20, 0);
      if (!res.success) throw new Error(res.error || "Failed to fetch product reviews");

      return (res.data?.items || []).map((rev: any) => ({
        id: rev.id || rev._id,
        product_id: productId,
        user_id: rev.user?.id || rev.user || "",
        rating: rev.rating || 0,
        comment: rev.content || "",
        created_at: rev.createdAt || new Date().toISOString(),
        updated_at: rev.updatedAt || new Date().toISOString(),
        author: rev.user ? {
          id: rev.user.id || rev.user._id || "",
          username: rev.user.username || "",
          display_name: rev.user.displayName || "",
          avatar_url: rev.user.avatar || null
        } : undefined
      })) as ProductReview[];
    },
    enabled: !!productId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: { productId: string; rating: number; comment: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.product.addProductReview(input.productId, input.rating, input.comment);
      if (!res.success) throw new Error(res.error || "Failed to add review");

      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product_reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      toast.success('Đã gửi đánh giá của bạn!');
    },
    onError: (error: any) => {
      toast.error('Lỗi gửi đánh giá: ' + error.message);
    },
  });
};
