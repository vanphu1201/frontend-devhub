import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
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
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  series_id: string | null;
  series_order: number | null;
  read_time_minutes: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
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

export interface Series {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  target_audience: string | null;
  estimated_duration: string | null;
  thumbnail_url: string | null;
  tags: string[];
  is_published: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
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

const mapBlogPost = (p: any): BlogPost => {
  return {
    id: p.id || p._id,
    user_id: p.author?.id || p.author || "",
    title: p.title || "",
    slug: p.slug || "",
    excerpt: p.excerpt || null,
    content: p.content || null,
    thumbnail_url: p.thumbnail || null,
    category: p.category || null,
    tags: p.tags || [],
    is_published: p.status === 'approved' || p.isPublished || true,
    status: p.status || 'pending',
    is_featured: p.isFeatured || false,
    series_id: p.series || null,
    series_order: p.seriesOrder || null,
    read_time_minutes: p.readTime || 5,
    views_count: p.viewsCount || 0,
    likes_count: p.likesCount || p.likes?.length || 0,
    comments_count: p.commentsCount || 0,
    shares_count: p.sharesCount || 0,
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

const mapSeries = (s: any): Series => {
  return {
    id: s.id || s._id,
    user_id: s.author?.id || s.author || "",
    title: s.title || "",
    slug: s.slug || "",
    description: s.description || null,
    category: s.category || null,
    difficulty: s.difficulty || 'beginner',
    target_audience: s.targetAudience || null,
    estimated_duration: s.estimatedDuration || null,
    thumbnail_url: s.thumbnail || null,
    tags: s.tags || [],
    is_published: s.status === 'approved' || s.isPublished || true,
    status: s.status || 'pending',
    created_at: s.createdAt || new Date().toISOString(),
    updated_at: s.updatedAt || new Date().toISOString(),
    author: s.author ? {
      id: s.author.id || s.author._id || "",
      username: s.author.username || "",
      display_name: s.author.displayName || "",
      avatar_url: s.author.avatar || null
    } : undefined
  };
};

const mapBlogComment = (c: any): BlogComment => {
  return {
    id: c.id || c._id,
    blog_post_id: c.blogPost || "",
    user_id: c.author?.id || c.author || "",
    content: c.content || "",
    image_url: c.images && c.images.length > 0 ? c.images[0] : null,
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

export const useBlogPosts = (category?: string, sortBy: string = 'newest') => {
  return useQuery({
    queryKey: ['blog_posts', category, sortBy],
    queryFn: async () => {
      const mappedSort = sortBy === 'most_viewed' ? 'views' : sortBy === 'most_liked' ? 'likes' : 'latest';
      const res = await api.blog.getBlogPosts(category === 'all' ? '' : category, 20, 0, mappedSort);
      if (!res.success) throw new Error(res.error || "Failed to fetch blog posts");

      return (res.data?.items || []).map(mapBlogPost);
    },
  });
};

export const useAdminBlogPosts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['blog_posts', 'admin'],
    queryFn: async () => {
      const res = await api.blog.getAdminBlogPosts();
      if (!res.success) throw new Error(res.error || "Failed to fetch admin blog posts");

      return (res.data || []).map(mapBlogPost);
    },
    enabled: options?.enabled,
  });
};

export const useApproveBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' | 'pending' }) => {
      const res = await api.blog.approveBlogPost(id, status);
      if (!res.success) throw new Error(res.error || "Failed to approve blog post");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Đã cập nhật trạng thái bài viết');
    },
  });
};

export const useSeries = () => {
  return useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      // Mock series list or get from backend
      return [] as Series[];
    },
  });
};

export const useAdminSeries = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['series', 'admin'],
    queryFn: async () => {
      // Mock or call Admin series if exists
      return [] as Series[];
    },
    enabled: options?.enabled,
  });
};

export const useApproveSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' | 'pending' }) => {
      const res = await api.blog.approveBlogSeries(id, status === 'approved');
      if (!res.success) throw new Error(res.error || "Failed to approve series");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      toast.success('Đã cập nhật trạng thái series');
    },
  });
};

export const useSeriesDetail = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['series', idOrSlug],
    queryFn: async () => {
      return { series: {} as Series, posts: [] as BlogPost[] };
    },
    enabled: !!idOrSlug,
  });
};

export const useCreateSeries = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      category?: string;
      difficulty?: string;
      target_audience?: string;
      estimated_duration?: string;
      tags?: string[];
      thumbnail_url?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.createBlogSeries({
        title: input.title,
        description: input.description,
        tags: input.tags || []
      });

      if (!res.success) throw new Error(res.error || "Failed to create series");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      toast.success('Tạo series thành công!');
    },
  });
};

export const useUpdateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Series> & { id: string }) => {
      const res = await api.blog.updateBlogSeries(id, {
        title: updates.title,
        description: updates.description || undefined,
        tags: updates.tags
      });

      if (!res.success) throw new Error(res.error || "Failed to update series");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', data?.id] });
      toast.success('Cập nhật series thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.blog.deleteBlogSeries(id);
      if (!res.success) throw new Error(res.error || "Failed to delete series");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      toast.success('Đã xóa series');
    },
  });
};

export const useFeaturedBlogPosts = () => {
  return useQuery({
    queryKey: ['blog_posts', 'featured'],
    queryFn: async () => {
      const res = await api.blog.getFeaturedBlogPosts();
      if (!res.success) throw new Error(res.error || "Failed to fetch featured blog posts");

      return (res.data || []).map(mapBlogPost);
    },
  });
};

export const useBlogPost = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['blog_posts', idOrSlug],
    queryFn: async () => {
      const res = await api.blog.getBlogPost(idOrSlug);
      if (!res.success) throw new Error(res.error || "Failed to fetch blog post");

      return mapBlogPost(res.data);
    },
    enabled: !!idOrSlug,
  });
};

export const useIncrementBlogView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      // Incremented automatically on fetch
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts', postId] });
    },
  });
};

export const useUserBlogPosts = (userId: string) => {
  return useQuery({
    queryKey: ['blog_posts', 'user', userId],
    queryFn: async () => {
      const res = await api.blog.getUserBlogPosts(userId);
      if (!res.success) throw new Error(res.error || "Failed to fetch user blog posts");

      return (res.data || []).map(mapBlogPost);
    },
    enabled: !!userId,
  });
};

export const useUserSeries = (userId: string) => {
  return useQuery({
    queryKey: ['series', 'user', userId],
    queryFn: async () => {
      const res = await api.blog.getUserBlogSeries(userId);
      if (!res.success) throw new Error(res.error || "Failed to fetch user series");

      return (res.data || []).map(mapSeries);
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

      const res = await api.blog.createBlogPost({
        title: input.title,
        content: input.content,
        excerpt: input.excerpt || '',
        category: input.category || 'Khác',
        tags: input.tags || [],
        thumbnail: input.thumbnail_url || ''
      });

      if (!res.success) throw new Error(res.error || "Failed to create blog post");
      return mapBlogPost(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Tạo bài viết thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi tạo bài viết: ' + error.message);
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const res = await api.blog.updateBlogPost(id, {
        title: updates.title,
        content: updates.content || undefined,
        excerpt: updates.excerpt || undefined,
        category: updates.category || undefined,
        tags: updates.tags
      });

      if (!res.success) throw new Error(res.error || "Failed to update blog post");
      return mapBlogPost(res.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts', data.id] });
      toast.success('Cập nhật bài viết thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.blog.deleteBlogPost(postId);
      if (!res.success) throw new Error(res.error || "Failed to delete blog post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Đã xóa bài viết!');
    },
    onError: (error: any) => {
      toast.error('Lỗi xóa: ' + error.message);
    },
  });
};

export const useLikeBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.likeBlogPost(postId);
      if (!res.success) throw new Error(res.error || "Failed to like blog post");
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['blog_post_likes', postId] });
    },
  });
};

export const useUnlikeBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.unlikeBlogPost(postId);
      if (!res.success) throw new Error(res.error || "Failed to unlike blog post");
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['blog_post_likes', postId] });
    },
  });
};

export const useIsBlogPostLiked = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['blog_post_likes', postId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const res = await api.blog.isBlogPostLiked(postId);
      if (!res.success) return false;

      return !!res.data?.isLiked;
    },
    enabled: !!user?.id && !!postId,
  });
};

export const useBookmarkBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.bookmarkBlogPost(postId);
      if (!res.success) throw new Error(res.error || "Failed to bookmark blog post");
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['blog_post_bookmarks', postId] });
      toast.success('Đã lưu bài viết');
    },
  });
};

export const useUnbookmarkBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.unbookmarkBlogPost(postId);
      if (!res.success) throw new Error(res.error || "Failed to unbookmark blog post");
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['blog_post_bookmarks', postId] });
      toast.toast ? toast.toast({ description: 'Đã bỏ lưu bài viết' }) : toast.success('Đã bỏ lưu bài viết');
    },
  });
};

export const useIsBlogPostBookmarked = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['blog_post_bookmarks', postId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const res = await api.blog.isBlogPostBookmarked(postId);
      if (!res.success) return false;

      return !!res.data?.isBookmarked;
    },
    enabled: !!user?.id && !!postId,
  });
};

export const useShareBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      // Mock share
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts', postId] });
    },
  });
};

export const useBlogPostComments = (postId: string) => {
  return useQuery({
    queryKey: ['blog_comments', postId],
    queryFn: async () => {
      const res = await api.blog.getBlogPostComments(postId, 50, 0);
      if (!res.success) throw new Error(res.error || "Failed to fetch blog comments");

      return (res.data?.items || []).map(mapBlogComment);
    },
    enabled: !!postId,
  });
};

export const useCreateBlogPostComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content, image_url }: { postId: string, content: string, image_url?: string | null }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const images = image_url ? [image_url] : [];
      const res = await api.blog.createBlogPostComment(postId, content, images);
      if (!res.success) throw new Error(res.error || "Failed to create comment");

      return mapBlogComment(res.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog_comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts', variables.postId] });
      toast.success('Đã gửi bình luận!');
    },
    onError: (error: any) => {
      toast.error('Lỗi khi gửi bình luận: ' + error.message);
    },
  });
};

export const useLikeBlogPostComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string, postId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.likeBlogPostComment(postId, commentId);
      if (!res.success) throw new Error(res.error || "Failed to like comment");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog_comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['blog_comment_likes', variables.commentId] });
    },
  });
};

export const useUnlikeBlogPostComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string, postId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.blog.unlikeBlogPostComment(postId, commentId);
      if (!res.success) throw new Error(res.error || "Failed to unlike comment");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog_comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['blog_comment_likes', variables.commentId] });
    },
  });
};

export const useIsBlogPostCommentLiked = (commentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['blog_comment_likes', commentId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      return false;
    },
    enabled: !!user?.id && !!commentId,
  });
};

export const useUploadBlogPostCommentImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await api.post.uploadPostImage(file);
      if (!res.success) throw new Error(res.error || "Failed to upload image");

      return res.data?.imageUrl || res.data;
    },
    onError: (error: any) => {
      toast.error('Lỗi tải ảnh bình luận: ' + error.message);
    },
  });
};
