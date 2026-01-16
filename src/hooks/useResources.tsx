import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'pdf' | 'code' | 'image' | 'video';
  category: string | null;
  file_url: string | null;
  file_size: string | null;
  is_premium: boolean;
  price: number;
  downloads_count: number;
  rating: number;
  reviews_count: number;
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
    .select('id, username, display_name, avatar_url')
    .eq('id', userId)
    .single();
  return data;
}

export const useResources = (filter: 'all' | 'free' | 'premium' = 'all') => {
  return useQuery({
    queryKey: ['resources', filter],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'free') {
        query = query.eq('is_premium', false);
      } else if (filter === 'premium') {
        query = query.eq('is_premium', true);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      const resourcesWithAuthors = await Promise.all(
        (data || []).map(async (resource) => {
          const author = await fetchProfile(resource.user_id);
          return { ...resource, author } as Resource;
        })
      );

      return resourcesWithAuthors;
    },
  });
};

export const useResource = (resourceId: string) => {
  return useQuery({
    queryKey: ['resources', resourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();

      if (error) throw error;

      const author = await fetchProfile(data.user_id);
      return { ...data, author } as Resource;
    },
    enabled: !!resourceId,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: Partial<Resource>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resources')
        .insert({
          user_id: user.id,
          title: input.title!,
          description: input.description,
          type: input.type!,
          category: input.category,
          file_url: input.file_url,
          file_size: input.file_size,
          is_premium: input.is_premium || false,
          price: input.price || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Tạo tài liệu thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Resource> & { id: string }) => {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources', data.id] });
      toast.success('Cập nhật thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Đã xóa tài liệu!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};
