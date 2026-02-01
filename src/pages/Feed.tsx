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
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useCreatePost, useLikePost, useUnlikePost, useIsPostLiked, useUploadPostImage, Post } from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import CodeBlock from '@/components/ui/CodeBlock';

const renderContent = (content: string) => {
  // Regex to find code blocks: ```[language]\n[code]```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract language and code
      const innerContent = part.slice(3, -3).trim();
      const firstNewLineIndex = innerContent.indexOf('\n');

      let language = '';
      let code = innerContent;

      if (firstNewLineIndex !== -1) {
        const possibleLanguage = innerContent.slice(0, firstNewLineIndex).trim();
        // Basic check if it's a language name or just part of the code
        if (possibleLanguage.length < 20 && !possibleLanguage.includes(' ')) {
          language = possibleLanguage;
          code = innerContent.slice(firstNewLineIndex + 1).trim();
        }
      }

      return <CodeBlock key={index} code={code} language={language} />;
    }

    return (
      <div key={index} className="whitespace-pre-wrap mb-2 last:mb-0">
        {part}
      </div>
    );
  });
};

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
    <article className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {post.author?.avatar_url ? (
              <img
                src={post.author.avatar_url}
                alt={getAuthorName()}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-inner">
                {getInitial()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.user_id}`} className="font-semibold hover:text-primary transition-colors">
                  {getAuthorName()}
                </Link>
                {post.author?.reputation && post.author.reputation > 1000 && (
                  <Badge variant="gold" className="text-[10px] h-5">
                    ⭐ {(post.author.reputation / 1000).toFixed(1)}K RP
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
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed">
          {renderContent(post.content)}
        </div>
        {post.image_url && (
          <div className="mt-4 rounded-xl overflow-hidden border border-border">
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: posts, isLoading, error } = usePosts(activeTab);
  const createPost = useCreatePost();
  const uploadImage = useUploadPostImage();

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng bài');
      return;
    }
    if (!postContent.trim() && !selectedImage) {
      toast.error('Vui lòng nhập nội dung bài viết hoặc thêm ảnh');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage.mutateAsync(selectedImage);
      }

      // Extract hashtags from content
      const tags = postContent.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [];

      createPost.mutate({ content: postContent, tags, image_url: imageUrl }, {
        onSuccess: () => {
          setPostContent('');
          setSelectedImage(null);
          setImagePreview(null);
        }
      });
    } catch (err) {
      // Error handled by mutation toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertFormat = (format: string) => {
    const textarea = document.getElementById('post-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    let newText = '';
    let newCursorPos = start;

    switch (format) {
      case 'code':
        newText = before + '```\n\n```' + after;
        newCursorPos = start + 4;
        break;
      case 'hash':
        newText = before + '#' + after;
        newCursorPos = start + 1;
        break;
      case 'at':
        newText = before + '@' + after;
        newCursorPos = start + 1;
        break;
    }

    setPostContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0 shadow-lg">
                  {getInitial()}
                </div>
                <div className="flex-1">
                  <textarea
                    id="post-textarea"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={user ? "Chia sẻ kiến thức, đặt câu hỏi hoặc viết code..." : "Đăng nhập để chia sẻ..."}
                    className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg leading-relaxed pt-2"
                    disabled={!user}
                  />

                  {imagePreview && (
                    <div className="relative mt-4 rounded-xl overflow-hidden border border-border group animate-fade-in">
                      <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                      <button
                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-destructive hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Live Preview for Code/Formatting */}
                  {postContent.includes('```') && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Xem trước bài đăng</div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed opacity-80">
                        {renderContent(postContent)}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-border/50 mt-4 gap-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id="image-input"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => document.getElementById('image-input')?.click()}
                      >
                        <Image className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => insertFormat('code')}
                      >
                        <Code className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => insertFormat('hash')}
                      >
                        <Hash className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => insertFormat('at')}
                      >
                        <AtSign className="w-6 h-6" />
                      </Button>
                    </div>

                    {user ? (
                      <Button
                        variant="gradient"
                        className="gap-2 px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={handleCreatePost}
                        disabled={isSubmitting || createPost.isPending || (!postContent.trim() && !selectedImage)}
                      >
                        {isSubmitting || createPost.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                        <span className="text-base font-semibold">Đăng bài</span>
                      </Button>
                    ) : (
                      <Button variant="gradient" asChild className="rounded-xl px-8">
                        <Link to="/login">Đăng nhập</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Tabs */}
            <div className="flex items-center gap-2 bg-card rounded-2xl border border-border p-1.5 shadow-sm">
              {[
                { id: 'trending', label: 'Xu hướng', icon: Flame },
                { id: 'latest', label: 'Mới nhất', icon: Clock },
                { id: 'following', label: 'Đang theo dõi', icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-y-[-1px]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
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
