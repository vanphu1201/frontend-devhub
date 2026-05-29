import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  image_size?: string | null;
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
  image_size?: string | null;
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

const mapPost = (p: any): Post => {
  return {
    id: p.id || p._id,
    user_id: p.author?.id || p.author || "",
    content: p.content || "",
    image_url: p.images && p.images.length > 0 ? p.images[0] : null,
    image_size: 'full',
    tags: p.tags || [],
    likes_count: p.likesCount || p.likes?.length || 0,
    comments_count: p.commentsCount || 0,
    shares_count: p.sharesCount || 0,
    views_count: p.viewsCount || 0,
    created_at: p.createdAt || new Date().toISOString(),
    author: p.author ? {
      id: p.author.id || p.author._id || "",
      username: p.author.username || "",
      display_name: p.author.displayName || "",
      avatar_url: p.author.avatar || null,
      reputation: p.author.reputation || 0
    } : undefined
  };
};

const mapComment = (c: any): Comment => {
  return {
    id: c.id || c._id,
    post_id: c.post || "",
    user_id: c.author?.id || c.author || "",
    content: c.content || "",
    image_url: c.images && c.images.length > 0 ? c.images[0] : null,
    image_size: 'full',
    parent_id: c.parentComment || null,
    likes_count: c.likesCount || c.likes?.length || 0,
    created_at: c.createdAt || new Date().toISOString(),
    author: c.author ? {
      id: c.author.id || c.author._id || "",
      username: c.author.username || "",
      display_name: c.author.displayName || "",
      avatar_url: c.author.avatar || null
    } : undefined
  };
};

export const usePosts = (filter: 'trending' | 'latest' | 'following' = 'latest', search?: string) => {
  return useQuery({
    queryKey: ['posts', filter, search],
    queryFn: async () => {
      const res = await api.post.getPosts(filter, 20, 0, search);
      if (!res.success) throw new Error(res.error || "Failed to fetch posts");

      return (res.data?.items || []).map(mapPost);
    },
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await api.post.getPost(postId);
      if (!res.success) throw new Error(res.error || "Failed to fetch post");

      return mapPost(res.data);
    },
    enabled: !!postId,
  });
};

export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await api.post.getUserPosts(userId, 20, 0);
      if (!res.success) throw new Error(res.error || "Failed to fetch user posts");

      return (res.data?.items || []).map(mapPost);
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

      const images = image_url ? [image_url] : [];
      const res = await api.post.createPost(content, images);
      if (!res.success) throw new Error(res.error || "Failed to create post");

      return mapPost(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đã đăng bài viết mới!');
    },
    onError: (error: any) => {
      toast.error('Lỗi khi đăng bài: ' + error.message);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.post.deletePost(postId);
      if (!res.success) throw new Error(res.error || "Failed to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đã xóa bài viết!');
    },
    onError: (error: any) => {
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
      if (!postId) throw new Error('Post ID is required');

      const res = await api.post.likePost(postId);
      if (!res.success) throw new Error(res.error || "Failed to like post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post_likes'] });
    },
    onError: (error: any) => {
      toast.error('Lỗi khi thích bài viết: ' + (error.message || 'Lỗi server'));
    }
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      if (!postId) throw new Error('Post ID is required');

      const res = await api.post.unlikePost(postId);
      if (!res.success) throw new Error(res.error || "Failed to unlike post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post_likes'] });
    },
    onError: (error: any) => {
      toast.error('Lỗi khi bỏ thích: ' + (error.message || 'Lỗi server'));
    }
  });
};

export const useIsPostLiked = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['post_likes', postId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const res = await api.post.isPostLiked(postId);
      if (!res.success) return false;

      return !!res.data?.isLiked;
    },
    enabled: !!user?.id && !!postId,
  });
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.post.getPostComments(postId, 50, 0);
      if (!res.success) throw new Error(res.error || "Failed to fetch post comments");

      return (res.data?.items || []).map(mapComment);
    },
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content, image_url }: { postId: string, content: string, image_url?: string | null }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const images = image_url ? [image_url] : [];
      const res = await api.post.createPostComment(postId, content, images);
      if (!res.success) throw new Error(res.error || "Failed to create comment");

      return mapComment(res.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Đã gửi bình luận!');
    },
    onError: (error: any) => {
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

      const res = await api.post.likePostComment(postId, commentId);
      if (!res.success) throw new Error(res.error || "Failed to like comment");
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

      const res = await api.post.unlikePostComment(postId, commentId);
      if (!res.success) throw new Error(res.error || "Failed to unlike comment");
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

      // Safe placeholder or API check
      return false;
    },
    enabled: !!user?.id && !!commentId,
  });
};

export const useUploadCommentImage = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.post.uploadPostImage(file);
      if (!res.success) throw new Error(res.error || "Failed to upload image");

      return res.data?.imageUrl || res.data;
    },
    onError: (error: any) => {
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

      const checkRes = await api.post.isPostBookmarked(postId);
      const isBookmarked = checkRes.success && !!checkRes.data?.isBookmarked;

      if (isBookmarked) {
        await api.post.unbookmarkPost(postId);
        return { bookmarked: false };
      } else {
        await api.post.bookmarkPost(postId);
        return { bookmarked: true };
      }
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', postId, user?.id] });
      toast.success('Đã cập nhật dấu trang!');
    },
    onError: (error: any) => {
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

      const res = await api.post.isPostBookmarked(postId);
      if (!res.success) return false;

      return !!res.data?.isBookmarked;
    },
    enabled: !!user?.id && !!postId,
  });
};

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      // Mock share increment or trigger API
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUploadPostImage = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.post.uploadPostImage(file);
      if (!res.success) throw new Error(res.error || "Failed to upload image");

      return res.data?.imageUrl || res.data;
    },
    onError: (error: any) => {
      toast.error('Lỗi tải ảnh: ' + error.message);
    },
  });
};
