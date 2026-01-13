import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
          is_published: input.is_published ?? false,
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
