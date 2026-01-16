import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnail_url: string | null;
  category: string | null;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  series_id: string | null;
  series_order: number | null;
  read_time_minutes: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
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

// Helper function to fetch profile for a user
async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, reputation')
    .eq('id', userId)
    .single();
  return data;
}

export const useBlogPosts = (category?: string) => {
  return useQuery({
    queryKey: ['blog_posts', category],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      // Fetch profiles for each post
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const author = await fetchProfile(post.user_id);
          return { ...post, author } as BlogPost;
        })
      );

      return postsWithAuthors;
    },
  });
};

export const useFeaturedBlogPosts = () => {
  return useQuery({
    queryKey: ['blog_posts', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const author = await fetchProfile(post.user_id);
          return { ...post, author } as BlogPost;
        })
      );

      return postsWithAuthors;
    },
  });
};

export const useBlogPost = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['blog_posts', idOrSlug],
    queryFn: async () => {
      // Check if it's a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      
      let query = supabase
        .from('blog_posts')
        .select('*');

      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();
      if (error) throw error;

      const author = await fetchProfile(data.user_id);
      return { ...data, author } as BlogPost;
    },
    enabled: !!idOrSlug,
  });
};

export const useUserBlogPosts = (userId: string) => {
  return useQuery({
    queryKey: ['blog_posts', 'user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const author = await fetchProfile(userId);
      return (data || []).map(post => ({ ...post, author })) as BlogPost[];
    },
    enabled: !!userId,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      content: string;
      excerpt?: string;
      category?: string;
      tags?: string[];
      thumbnail_url?: string;
      is_published?: boolean;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const slug = input.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          user_id: user.id,
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt,
          category: input.category,
          tags: input.tags || [],
          thumbnail_url: input.thumbnail_url,
          is_published: input.is_published ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Tạo bài viết thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi tạo bài viết: ' + error.message);
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts', data.id] });
      toast.success('Cập nhật bài viết thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Đã xóa bài viết!');
    },
    onError: (error) => {
      toast.error('Lỗi xóa: ' + error.message);
    },
  });
};
