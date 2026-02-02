import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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

// Helper function to fetch profile for a user
async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, reputation')
    .eq('id', userId)
    .single();
  return data;
}

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      const productsWithAuthors = await Promise.all(
        (data || []).map(async (product) => {
          const author = await fetchProfile(product.user_id);
          return { ...product, author } as Product;
        })
      );

      return productsWithAuthors;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('downloads_count', { ascending: false })
        .limit(6);

      if (error) throw error;

      const productsWithAuthors = await Promise.all(
        (data || []).map(async (product) => {
          const author = await fetchProfile(product.user_id);
          return { ...product, author } as Product;
        })
      );

      return productsWithAuthors;
    },
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      const author = await fetchProfile(data.user_id);
      return { ...data, author } as Product;
    },
    enabled: !!productId,
  });
};

export const useUserProducts = (userId: string) => {
  return useQuery({
    queryKey: ['products', 'user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
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

      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;

      // Fetch products for each purchase
      const purchasesWithProducts = await Promise.all(
        (data || []).map(async (purchase) => {
          const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', purchase.product_id)
            .single();
          return { ...purchase, product } as Purchase;
        })
      );

      return purchasesWithProducts;
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

      const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
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

      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          product_id: productId,
          price_paid: price,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Mua sản phẩm thành công!');
    },
    onError: (error) => {
      if (error.message.includes('duplicate')) {
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

      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          name: input.name!,
          description: input.description!,
          long_description: input.long_description,
          category: input.category,
          price: input.price || 0,
          original_price: input.original_price,
          tech_stack: input.tech_stack || [],
          preview_images: input.preview_images || [],
          demo_url: input.demo_url,
          documentation_url: input.documentation_url,
          download_url: input.download_url,
          version: input.version || '1.0.0',
          support_duration: input.support_duration || '6 tháng',
          is_published: input.is_published ?? false,
          is_featured: input.is_featured ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Tạo sản phẩm thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi tạo sản phẩm: ' + error.message);
    },
  });
};

export const useAdminProducts = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['products', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const productsWithAuthors = await Promise.all(
        (data || []).map(async (product) => {
          const author = await fetchProfile(product.user_id);
          return { ...product, author } as Product;
        })
      );

      return productsWithAuthors;
    },
    enabled: isAdmin,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviewsWithAuthors = await Promise.all(
        (data || []).map(async (review) => {
          const author = await fetchProfile(review.user_id);
          return { ...review, author } as ProductReview;
        })
      );

      return reviewsWithAuthors;
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

      const { data, error } = await supabase
        .from('product_reviews')
        .upsert({
          product_id: input.productId,
          user_id: user.id,
          rating: input.rating,
          comment: input.comment,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
