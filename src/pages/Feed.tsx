import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Image, 
  Code, 
  Hash, 
  AtSign,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Flame,
  Eye,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useCreatePost, useLikePost, useUnlikePost, useIsPostLiked, Post } from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { user } = useAuth();
  const { data: isLiked } = useIsPostLiked(post.id);
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  const handleLike = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để like bài viết');
      return;
    }
    if (isLiked) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };

  const getInitial = () => {
    if (post.author?.display_name) return post.author.display_name[0].toUpperCase();
    if (post.author?.username) return post.author.username[0].toUpperCase();
    return 'U';
  };

  const getAuthorName = () => {
    return post.author?.display_name || post.author?.username || 'Người dùng';
  };

  const getUsername = () => {
    return post.author?.username ? `@${post.author.username}` : '';
  };

  const formatTime = (dateStr: string) => {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  };

  return (
    <article className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {post.author?.avatar_url ? (
              <img 
                src={post.author.avatar_url} 
                alt={getAuthorName()}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {getInitial()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.user_id}`} className="font-semibold hover:text-primary">
                  {getAuthorName()}
                </Link>
                {post.author?.reputation && post.author.reputation > 1000 && (
                  <Badge variant="gold" className="text-xs">
                    ⭐ {Math.floor(post.author.reputation / 1000)}K RP
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{getUsername()}</span>
                {getUsername() && <span>•</span>}
                <span>{formatTime(post.created_at)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views_count?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="tech">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
            disabled={likePost.isPending || unlikePost.isPending}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes_count || 0}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            {post.comments_count || 0}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            {post.shares_count || 0}
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>
    </article>
  );
};

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'following'>('latest');
  
  const { data: posts, isLoading, error } = usePosts(activeTab);
  const createPost = useCreatePost();

  const handleCreatePost = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng bài');
      return;
    }
    if (!postContent.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    // Extract hashtags from content
    const tags = postContent.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [];
    
    createPost.mutate({ content: postContent, tags }, {
      onSuccess: () => {
        setPostContent('');
      }
    });
  };

  const trendingTopics = [
    { tag: 'React', posts: 1234 },
    { tag: 'TypeScript', posts: 987 },
    { tag: 'AI', posts: 876 },
    { tag: 'Next.js', posts: 654 },
    { tag: 'DevOps', posts: 543 },
  ];

  const getInitial = () => {
    if (!user) return 'D';
    const email = user.email || '';
    return email[0]?.toUpperCase() || 'D';
  };

  return (
    <Layout showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* Create Post */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                  {getInitial()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={user ? "Chia sẻ kiến thức, đặt câu hỏi hoặc viết code..." : "Đăng nhập để chia sẻ..."}
                    className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground"
                    disabled={!user}
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Image className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Code className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Hash className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <AtSign className="w-5 h-5" />
                      </Button>
                    </div>
                    {user ? (
                      <Button 
                        variant="gradient" 
                        className="gap-2" 
                        onClick={handleCreatePost}
                        disabled={createPost.isPending || !postContent.trim()}
                      >
                        {createPost.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Đăng bài
                      </Button>
                    ) : (
                      <Button variant="gradient" asChild>
                        <Link to="/login">Đăng nhập</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Tabs */}
            <div className="flex items-center gap-2 bg-card rounded-xl border border-border p-1">
              {[
                { id: 'trending', label: 'Xu hướng', icon: Flame },
                { id: 'latest', label: 'Mới nhất', icon: Clock },
                { id: 'following', label: 'Đang theo dõi', icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive">
                  Lỗi tải bài viết: {error.message}
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">Chưa có bài viết nào</p>
                  <p className="text-sm">
                    {activeTab === 'following' 
                      ? 'Hãy theo dõi ai đó để xem bài viết của họ!'
                      : 'Hãy là người đầu tiên chia sẻ!'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Trending Topics */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Xu hướng</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">{index + 1}</span>
                      <Badge variant="tech" className="cursor-pointer hover:bg-primary/20">
                        #{topic.tag}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{topic.posts} bài</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="font-semibold mb-4">Thống kê hôm nay</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{posts?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Bài viết</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {posts?.reduce((acc, p) => acc + (p.likes_count || 0), 0) || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Lượt thích</div>
                </div>
              </div>
            </div>

            {/* Login CTA for guests */}
            {!user && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold mb-2">Tham gia cộng đồng</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Đăng ký để chia sẻ bài viết và tương tác với cộng đồng developer
                </p>
                <div className="space-y-2">
                  <Button variant="gradient" className="w-full" asChild>
                    <Link to="/register">Đăng ký miễn phí</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
