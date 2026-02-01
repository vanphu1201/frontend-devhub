import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronLeft,
  List,
  Loader2
} from 'lucide-react';

import {
  useBlogPost,
  useLikeBlogPost,
  useUnlikeBlogPost,
  useIsBlogPostLiked,
  useBookmarkBlogPost,
  useUnbookmarkBlogPost,
  useIsBlogPostBookmarked,
  useShareBlogPost,
  useIncrementBlogView,
  useBlogPostComments
} from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from 'sonner';
import BlogCommentDialog from '@/components/blog/BlogCommentDialog';
import { useFollowUser, useUnfollowUser, useIsFollowing } from '@/hooks/useProfile';
import ContentRenderer from '@/components/ui/ContentRenderer';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const FollowButton: React.FC<{ authorId: string }> = ({ authorId }) => {
  const { user } = useAuth();
  const { data: isFollowing } = useIsFollowing(authorId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const handleFollow = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để theo dõi tác giả');
      return;
    }
    if (user.id === authorId) {
      toast.error('Bạn không thể theo dõi chính mình');
      return;
    }

    if (isFollowing) {
      unfollowUser.mutate(authorId);
    } else {
      followUser.mutate(authorId);
    }
  };

  if (user?.id === authorId) return null;

  return (
    <Button
      variant={isFollowing ? "outline" : "gradient"}
      size="sm"
      onClick={handleFollow}
      disabled={followUser.isPending || unfollowUser.isPending}
      className={isFollowing ? "border-primary text-primary hover:bg-primary/10" : ""}
    >
      {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
    </Button>
  );
};


const generateTableOfContents = (content: string) => {
  const lines = content.split('\n');
  const toc: { id: string; title: string; level: number }[] = [];

  lines.forEach(line => {
    if (line.startsWith('# ')) {
      const title = line.replace('# ', '').trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, title, level: 1 });
    } else if (line.startsWith('## ')) {
      const title = line.replace('## ', '').trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, title, level: 2 });
    } else if (line.startsWith('### ')) {
      const title = line.replace('### ', '').trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, title, level: 3 });
    }
  });

  return toc;
};

const BlogPost: React.FC = () => {
  const { id: idOrSlug } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(idOrSlug || '');
  const { user } = useAuth();
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const { data: isLiked } = useIsBlogPostLiked(post?.id || '');
  const { data: isBookmarked } = useIsBlogPostBookmarked(post?.id || '');

  const likePost = useLikeBlogPost();
  const unlikePost = useUnlikeBlogPost();
  const bookmarkPost = useBookmarkBlogPost();
  const unbookmarkPost = useUnbookmarkBlogPost();
  const sharePost = useShareBlogPost();
  const incrementView = useIncrementBlogView();

  const { data: comments } = useBlogPostComments(post?.id || '');

  const cleanedContent = post?.content?.replace(/\\n/g, '\n') || '';
  const tableOfContents = post ? generateTableOfContents(cleanedContent) : [];
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (post?.id) {
      incrementView.mutate(post.id);
    }
  }, [post?.id]);

  const topComments = (comments?.filter(c => (c.likes_count || 0) > 0) || [])
    .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
    .slice(0, 3);

  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  const handleLike = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    if (isLiked) {
      unlikePost.mutate(post!.id);
    } else {
      likePost.mutate(post!.id);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu bài viết');
      return;
    }
    if (isBookmarked) {
      unbookmarkPost.mutate(post!.id);
    } else {
      bookmarkPost.mutate(post!.id);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Đã sao chép liên kết vào bộ nhớ tạm!');
      }
      sharePost.mutate(post.id);
    } catch (err) {
      // User cancelled
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <div className="text-xl text-muted-foreground">Đang tải bài viết...</div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
          <Button asChild variant="outline">
            <Link to="/blog">Quay lại Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/blog" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Blog
          </Link>
          <span>/</span>
          <span>{post.category}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div>
            {/* Series Banner */}
            {post.series_id && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center text-primary font-bold">
                      S
                    </div>
                    <div>
                      <Badge variant="gradient" className="mb-1">Series</Badge>
                      <h4 className="font-semibold text-sm">Phần của Series kiến thức</h4>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/blog/series/${post.series_id}`}>Xem series</Link>
                  </Button>
                </div>
              </div>
            )}
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {(post.tags || []).map((tag: string) => (
                  <Badge key={tag} variant="tech">{tag}</Badge>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" />
                  {post.read_time_minutes} phút
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-primary" />
                  {(post.views_count || 0).toLocaleString()} lượt xem
                </span>
              </div>
            </header>

            {/* Author Card */}
            <div className="bg-card rounded-xl border border-border p-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm">
                  {post.author?.display_name?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${post.author?.username}`} className="font-semibold hover:text-primary transition-colors">
                      {post.author?.display_name || 'Người dùng'}
                    </Link>
                    <Badge variant="gold" className="text-[10px] h-5">Pro</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-medium">
                    <span className="text-amber-500">⭐ {((post.author as any)?.reputation || 0).toLocaleString()} RP</span>
                  </div>
                </div>
                <FollowButton authorId={post.user_id} />
              </div>
            </div>

            {/* Article Image if available */}
            {post.thumbnail_url && (
              <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-border shadow-md">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <ContentRenderer content={cleanedContent} />
            </article>

            {/* Article Actions */}
            <div className="flex items-center justify-between py-6 border-y border-border mb-12">
              <div className="flex items-center gap-3">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  className={`gap-2 rounded-xl transition-all ${isLiked ? 'bg-primary' : 'hover:border-primary hover:text-primary'}`}
                  onClick={handleLike}
                  disabled={likePost.isPending || unlikePost.isPending}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-bold">{post.likes_count || 0}</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl hover:border-primary hover:text-primary transition-all"
                  onClick={() => setIsCommentOpen(true)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-bold">{post.comments_count || 0}</span>
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-xl transition-all ${isBookmarked ? 'text-primary bg-primary/10' : 'hover:text-primary'}`}
                  onClick={handleBookmark}
                  disabled={bookmarkPost.isPending || unbookmarkPost.isPending}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:text-primary transition-all"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Comments Preview/CTA */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Thảo luận ({post.comments_count || 0})
                </h3>
                <Button variant="outline" size="sm" onClick={() => setIsCommentOpen(true)}>
                  Xem tất cả
                </Button>
              </div>

              {/* Top Comments List */}
              {topComments.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bình luận nổi bật</div>
                  {topComments.map((comment) => (
                    <div key={comment.id} className="bg-card/50 rounded-2xl p-5 border border-border hover:border-primary/20 transition-all">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-bold shrink-0">
                          {comment.author?.display_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">{comment.author?.display_name || 'Người dùng'}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi }) : ''}
                            </span>
                          </div>
                          <div className="text-sm text-foreground/90 line-clamp-3 mb-2">
                            <ContentRenderer content={comment.content} />
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5 text-primary/80 bg-primary/5 px-2 py-1 rounded-lg">
                              <Heart className="w-3.5 h-3.5 fill-current" />
                              {comment.likes_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-muted/30 rounded-2xl p-8 border border-border text-center">
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Chia sẻ ý kiến của bạn, đặt câu hỏi hoặc đóng góp thêm kiến thức cho cộng đồng.
                </p>
                <Button onClick={() => setIsCommentOpen(true)} className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
                  Viết bình luận
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 sticky top-24 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <List className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg tracking-tight">Mục lục</h3>
              </div>
              <nav className="space-y-1 relative">
                {/* Active indicator line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-muted/30" />

                {tableOfContents.length > 0 ? tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block py-2 text-sm transition-all relative pl-5 hover:text-primary ${activeId === item.id
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground font-medium'
                      }`}
                    style={{ marginLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {activeId === item.id && (
                      <div className="absolute left-[-1.5px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    )}
                    {item.title}
                  </a>
                )) : (
                  <p className="text-sm text-muted-foreground italic">Không có nội dung chính</p>
                )}
              </nav>

              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Đang đọc bài viết</h4>
                  <p className="text-sm font-semibold line-clamp-2 leading-snug">{post.title}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BlogCommentDialog
        post={post}
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />
    </Layout>
  );
};
export default BlogPost;
