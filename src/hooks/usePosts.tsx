import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  image_url?: string | null;
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

export interface CreatePostInput {
  content: string;
  tags?: string[];
  image_url?: string | null;
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

export const usePosts = (filter: 'trending' | 'latest' | 'following' = 'latest') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['posts', filter, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('is_published', true);

      if (filter === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (filter === 'trending') {
        query = query.order('likes_count', { ascending: false });
      } else if (filter === 'following' && user?.id) {
        const { data: follows } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        const followingIds = follows?.map(f => f.following_id) || [];

        if (followingIds.length > 0) {
          query = query.in('user_id', followingIds);
        } else {
          return [];
        }
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      // Fetch profiles for each post
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const author = await fetchProfile(post.user_id);
          return { ...post, author } as Post;
        })
      );

      return postsWithAuthors;
    },
  });
};

export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const author = await fetchProfile(userId);
      return (data || []).map(post => ({ ...post, author })) as Post[];
    },
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      if (!user?.id) throw new Error('Not authenticated');

      const insertData: any = {
        user_id: user.id,
        content: input.content,
        tags: input.tags || [],
      };

      if (input.image_url) {
        insertData.image_url = input.image_url;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đăng bài thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi đăng bài: ' + error.message);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đã xóa bài viết!');
    },
    onError: (error) => {
      toast.error('Lỗi xóa bài: ' + error.message);
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;

      // Update likes count manually
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('posts')
          .update({ likes_count: (post.likes_count || 0) + 1 })
          .eq('id', postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post_likes'] });
    },
    onError: (error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Bạn đã like bài viết này rồi!');
      } else {
        toast.error('Lỗi: ' + error.message);
      }
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update likes count manually
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post && post.likes_count > 0) {
        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count - 1 })
          .eq('id', postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post_likes'] });
    },
  });
};

export const useIsPostLiked = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['post_likes', postId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && !!postId,
  });
};

export const useUploadPostImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error) => {
      toast.error('Lỗi tải ảnh: ' + error.message);
    },
  });
};
