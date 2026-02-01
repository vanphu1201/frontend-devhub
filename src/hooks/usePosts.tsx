import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  tags?: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: string;
  author?: {
    id?: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    reputation: number | null;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  parent_id?: string | null;
  likes_count: number;
  created_at: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

const fetchProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, reputation')
      .eq('id', userId)
      .single();

    if (error) return undefined;
    return data;
  } catch (err) {
    return undefined;
  }
};

export const usePosts = (filter: 'trending' | 'latest' | 'following' = 'latest') => {
  return useQuery({
    queryKey: ['posts', filter],
    queryFn: async () => {
      let query = supabase.from('posts').select('*');

      if (filter === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (filter === 'trending') {
        query = query.order('likes_count', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post: any) => {
          const author = await fetchProfile(post.user_id);
          return {
            ...post,
            author,
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            shares_count: post.shares_count || 0,
            views_count: post.views_count || 0
          } as Post;
        })
      );

      return postsWithAuthors;
    },
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      const author = await fetchProfile(data.user_id);
      return {
        ...data,
        author,
        likes_count: data.likes_count || 0,
        comments_count: data.comments_count || 0,
        shares_count: data.shares_count || 0,
        views_count: data.views_count || 0
      } as Post;
    },
    enabled: !!postId,
  });
};

export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post: any) => {
          const author = await fetchProfile(post.user_id);
          return {
            ...post,
            author,
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            shares_count: post.shares_count || 0,
            views_count: post.views_count || 0
          } as Post;
        })
      );

      return postsWithAuthors;
    },
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ content, tags, image_url }: { content: string, tags: string[], image_url?: string | null }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          tags,
          image_url,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đã đăng bài viết mới!');
    },
    onError: (error) => {
      toast.error('Lỗi khi đăng bài: ' + error.message);
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
      toast.error('Lỗi khi xóa bài viết: ' + error.message);
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

      // Update likes count on post
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

      // Update likes count on post
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

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithAuthors = await Promise.all(
        (data || []).map(async (comment: any) => {
          const author = await fetchProfile(comment.user_id);
          return {
            ...comment,
            author,
            likes_count: comment.likes_count || 0
          } as Comment;
        })
      );

      return commentsWithAuthors;
    },
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content, image_url, parent_id }: { postId: string, content: string, image_url?: string | null, parent_id?: string | null }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const insertData: any = {
        post_id: postId,
        user_id: user.id,
        content,
      };

      if (image_url) insertData.image_url = image_url;
      if (parent_id) insertData.parent_id = parent_id;

      const { data, error } = await supabase
        .from('comments')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Update comments count on post
      const { data: post } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('posts')
          .update({ comments_count: (post.comments_count || 0) + 1 })
          .eq('id', postId);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đã gửi bình luận!');
    },
    onError: (error) => {
      toast.error('Lỗi khi gửi bình luận: ' + error.message);
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string, postId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await (supabase as any)
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['comment_likes'] });
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string, postId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await (supabase as any)
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['comment_likes'] });
    },
  });
};

export const useIsCommentLiked = (commentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['comment_likes', commentId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await (supabase as any)
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && !!commentId,
  });
};

export const useUploadCommentImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `comment-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error) => {
      toast.error('Lỗi tải ảnh bình luận: ' + error.message);
    },
  });
};

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { bookmarked: false };
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
        return { bookmarked: true };
      }
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', postId, user?.id] });
      toast.success('Đã cập nhật dấu trang!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useIsPostBookmarked = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookmarks', postId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('bookmarks')
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

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data: post } = await supabase
        .from('posts')
        .select('shares_count')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('posts')
          .update({ shares_count: (post.shares_count || 0) + 1 })
          .eq('id', postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUploadPostImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
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
