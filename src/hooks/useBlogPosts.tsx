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

// Helper function to fetch profile for a user
async function fetchProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, reputation')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('Profile not found for user:', userId);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Error in fetchProfile:', err);
    return null;
  }
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

export const useBlogPosts = (category?: string, sortBy: string = 'newest') => {
  return useQuery({
    queryKey: ['blog_posts', category, sortBy],
    queryFn: async () => {
      let query = (supabase as any)
        .from('blog_posts')
        .select(`
          *,
          blog_post_likes(count),
          blog_post_comments(count)
        `)
        .eq('is_published', true)
        .eq('status', 'approved');

      // Sort logic
      if (sortBy === 'most_viewed') {
        query = query.order('views_count', { ascending: false });
      } else if (sortBy === 'most_liked') {
        query = query.order('likes_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      // Fetch profiles for each post and normalize counts
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post: any) => {
          const author = await fetchProfile(post.user_id);
          return {
            ...post,
            author,
            likes_count: post.blog_post_likes?.[0]?.count ?? post.likes_count ?? 0,
            comments_count: post.blog_post_comments?.[0]?.count ?? post.comments_count ?? 0
          } as BlogPost;
        })
      );

      return postsWithAuthors;
    },
  });
};

export const useAdminBlogPosts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['blog_posts', 'admin'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const author = await fetchProfile(post.user_id);
          return { ...post, author } as BlogPost;
        })
      );

      return postsWithAuthors;
    },
    enabled: options?.enabled,
  });
};

export const useApproveBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' | 'pending' }) => {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('series' as any)
        .select('*')
        .eq('status', 'approved') // Only show approved series to public
        .order('created_at', { ascending: false });

      if (error) throw error;

      const seriesWithAuthors = await Promise.all(
        (data || []).map(async (item: any) => {
          const author = await fetchProfile(item.user_id);
          return { ...item, author } as Series;
        })
      );

      return seriesWithAuthors;
    },
  });
};

export const useAdminSeries = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['series', 'admin'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('series')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const seriesWithAuthors = await Promise.all(
        (data || []).map(async (item) => {
          const author = await fetchProfile(item.user_id);
          return { ...item, author } as Series;
        })
      );

      return seriesWithAuthors;
    },
    enabled: options?.enabled,
  });
};

export const useApproveSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' | 'pending' }) => {
      const { data, error } = await (supabase as any)
        .from('series')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      // Check if it's a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

      let query = (supabase as any)
        .from('series')
        .select('*');

      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data: seriesData, error: seriesError } = await query.single();
      if (seriesError) throw seriesError;

      const author = await fetchProfile(seriesData.user_id);
      const series = { ...seriesData, author } as Series;

      // Fetch posts in this series
      const { data: postsData, error: postsError } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .eq('series_id', series.id)
        .eq('is_published', true)
        .eq('status', 'approved')
        .order('series_order', { ascending: true });

      if (postsError) throw postsError;

      const posts = await Promise.all(
        (postsData || []).map(async (post) => {
          const postAuthor = await fetchProfile(post.user_id);
          return { ...post, author: postAuthor } as BlogPost;
        })
      );

      return { series, posts };
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

      const slug = input.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      const { data, error } = await (supabase as any)
        .from('series')
        .insert({
          user_id: user.id,
          title: input.title,
          slug,
          description: input.description,
          category: input.category || 'general',
          difficulty: input.difficulty || 'beginner',
          target_audience: input.target_audience,
          estimated_duration: input.estimated_duration,
          tags: input.tags || [],
          thumbnail_url: input.thumbnail_url,
          is_published: true,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await (supabase as any)
        .from('series')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', data.id] });
      toast.success('Cập nhật series thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('series')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select(`
          *,
          blog_post_likes(count),
          blog_post_comments(count)
        `)
        .eq('is_published', true)
        .eq('is_featured', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post: any) => {
          const author = await fetchProfile(post.user_id);
          return {
            ...post,
            author,
            likes_count: post.blog_post_likes?.[0]?.count ?? post.likes_count ?? 0,
            comments_count: post.blog_post_comments?.[0]?.count ?? post.comments_count ?? 0
          } as BlogPost;
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

      let query = (supabase as any)
        .from('blog_posts')
        .select(`
          *,
          blog_post_likes(count),
          blog_post_comments(count)
        `);

      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single() as any;
      if (error) throw error;

      const author = await fetchProfile(data.user_id);

      let series = null;
      if (data.series_id) {
        const { data: seriesData } = await (supabase as any)
          .from('series')
          .select('*')
          .eq('id', data.series_id)
          .single();
        series = seriesData;
      }

      return {
        ...data,
        author,
        series,
        likes_count: data.blog_post_likes?.[0]?.count ?? data.likes_count ?? 0,
        comments_count: data.blog_post_comments?.[0]?.count ?? data.comments_count ?? 0
      } as BlogPost & { series: any };
    },
    enabled: !!idOrSlug,
  });
};

export const useIncrementBlogView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const { data: post } = await (supabase as any)
        .from('blog_posts')
        .select('views_count')
        .eq('id', postId)
        .single();

      if (post) {
        await (supabase as any)
          .from('blog_posts')
          .update({ views_count: (post.views_count || 0) + 1 })
          .eq('id', postId);
      }
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
      const { data, error } = await (supabase as any)
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

export const useUserSeries = (userId: string) => {
  return useQuery({
    queryKey: ['series', 'user', userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('series')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const author = await fetchProfile(userId);
      return (data || []).map(item => ({ ...item, author })) as Series[];
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

      const { data, error } = await (supabase as any)
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
          status: 'pending',
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
      const { data, error } = await (supabase as any)
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
      const { error } = await (supabase as any)
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

export const useLikeBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await (supabase as any)
        .from('blog_post_likes')
        .insert({ blog_post_id: postId, user_id: user.id });

      if (error) throw error;

      // Update likes count on blog post
      const { data: post } = await (supabase as any)
        .from('blog_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('blog_posts')
          .update({ likes_count: (post.likes_count || 0) + 1 })
          .eq('id', postId);
      }
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

      const { error } = await (supabase as any)
        .from('blog_post_likes')
        .delete()
        .eq('blog_post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update likes count on blog post
      const { data: post } = await (supabase as any)
        .from('blog_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post && post.likes_count > 0) {
        await supabase
          .from('blog_posts')
          .update({ likes_count: post.likes_count - 1 })
          .eq('id', postId);
      }
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

      const { data, error } = await (supabase as any)
        .from('blog_post_likes')
        .select('id')
        .eq('blog_post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
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

      const { error } = await (supabase as any)
        .from('bookmarks')
        .insert({ blog_post_id: postId, user_id: user.id });

      if (error) throw error;
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

      const { error } = await (supabase as any)
        .from('bookmarks')
        .delete()
        .eq('blog_post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['blog_post_bookmarks', postId] });
      toast.success('Đã bỏ lưu bài viết');
    },
  });
};

export const useIsBlogPostBookmarked = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['blog_post_bookmarks', postId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await (supabase as any)
        .from('bookmarks')
        .select('id')
        .eq('blog_post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && !!postId,
  });
};

export const useShareBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data: post } = await (supabase as any)
        .from('blog_posts')
        .select('shares_count')
        .eq('id', postId)
        .single();

      if (post) {
        await (supabase as any)
          .from('blog_posts')
          .update({ shares_count: (post.shares_count || 0) + 1 })
          .eq('id', postId);
      }
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts', postId] });
    },
  });
};

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

export const useBlogPostComments = (postId: string) => {
  return useQuery({
    queryKey: ['blog_comments', postId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_post_comments')
        .select('*')
        .eq('blog_post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithAuthors = await Promise.all(
        (data || []).map(async (comment: any) => {
          const author = await fetchProfile(comment.user_id);
          return {
            ...comment,
            author,
            likes_count: comment.likes_count || 0
          } as BlogComment;
        })
      );

      return commentsWithAuthors;
    },
    enabled: !!postId,
  });
};

export const useCreateBlogPostComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content, image_url, parent_id }: { postId: string, content: string, image_url?: string | null, parent_id?: string | null }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const insertData: any = {
        blog_post_id: postId,
        user_id: user.id,
        content,
      };

      if (image_url) insertData.image_url = image_url;
      if (parent_id) insertData.parent_id = parent_id;

      const { data, error } = await (supabase as any)
        .from('blog_post_comments')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Update comments count on blog post
      const { data: post } = await (supabase as any)
        .from('blog_posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (post) {
        await (supabase as any)
          .from('blog_posts')
          .update({ comments_count: (post.comments_count || 0) + 1 })
          .eq('id', postId);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog_comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts', variables.postId] });
      toast.success('Đã gửi bình luận!');
    },
    onError: (error) => {
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

      const { error } = await (supabase as any)
        .from('blog_post_comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });

      if (error) throw error;

      // Update likes count on comment
      const { data: comment } = await (supabase as any)
        .from('blog_post_comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (comment) {
        await (supabase as any)
          .from('blog_post_comments')
          .update({ likes_count: (comment.likes_count || 0) + 1 })
          .eq('id', commentId);
      }
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

      const { error } = await (supabase as any)
        .from('blog_post_comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update likes count on comment
      const { data: comment } = await (supabase as any)
        .from('blog_post_comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (comment && (comment.likes_count || 0) > 0) {
        await (supabase as any)
          .from('blog_post_comments')
          .update({ likes_count: comment.likes_count - 1 })
          .eq('id', commentId);
      }
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

      const { data, error } = await (supabase as any)
        .from('blog_post_comment_likes')
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

export const useUploadBlogPostCommentImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-comment-images/${fileName}`;

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
