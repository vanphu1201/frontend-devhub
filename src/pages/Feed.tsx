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
  X,
  Trophy,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  usePosts,
  useCreatePost,
  useLikePost,
  useUnlikePost,
  useIsPostLiked,
  useUploadPostImage,
  useBookmarkPost,
  useIsPostBookmarked,
  useSharePost,
  usePostComments,
  Post
} from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import CodeBlock from '@/components/ui/CodeBlock';
import CommentDialog from '@/components/home/CommentDialog';
import PostMenu from '@/components/home/PostMenu';
import ContentRenderer from '@/components/ui/ContentRenderer';
import VisualBlockEditor, { EditorBlock } from '@/components/ui/VisualBlockEditor';
import PostCard from '@/components/home/PostCard';
import { PostCardSkeleton } from '@/components/shared/Skeletons';


const Feed: React.FC = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: '1', type: 'text', content: '' }
  ]);
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'following'>('latest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: posts, isLoading, error } = usePosts(activeTab, searchTerm);
  const createPost = useCreatePost();
  const uploadImage = useUploadPostImage();

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng bài');
      return;
    }

    const hasContent = blocks.some(b =>
      (b.type === 'text' && b.content.trim()) ||
      (b.type === 'image' && b.url)
    );

    if (!hasContent) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Convert blocks to Markdown content
      let contentMarkdown = "";
      let firstImageUrl = null;
      let firstImageSize = 'full';

      blocks.forEach(block => {
        if (block.type === 'text') {
          contentMarkdown += block.content + "\n\n";
        } else if (block.type === 'image' && block.url) {
          if (!firstImageUrl) {
            firstImageUrl = block.url;
            // Map percentage width to predefined sizes for legacy support
            firstImageSize = block.width < 40 ? 'small' : block.width < 70 ? 'medium' : 'full';
          }
          // Store width in alt text: ![Alt|Width](url)
          contentMarkdown += `![Ảnh|${Math.round(block.width)}](${block.url})\n\n`;
        }
      });

      const finalContent = contentMarkdown.trim();

      // Extract hashtags from all text blocks
      const allText = blocks
        .filter(b => b.type === 'text')
        .map(b => (b as any).content)
        .join(' ');
      const tags = allText.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [];

      createPost.mutate({
        content: finalContent,
        tags,
        image_url: firstImageUrl,
        image_size: firstImageSize
      }, {
        onSuccess: () => {
          setBlocks([{ id: '1', type: 'text', content: '' }]);
        }
      });
    } catch (err) {
      // Error handled by mutation toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (file: File) => {
    return uploadImage.mutateAsync(file);
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
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-lg border border-border/50">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {getInitial()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <VisualBlockEditor
                    blocks={blocks}
                    onChange={setBlocks}
                    onUploadImage={handleImageUpload}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-border/50 mt-4 gap-4">
                    <div className="flex items-center gap-4">
                      {/* Formats can be added back if we handle them in blocks */}
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Visual Editor Mode
                      </span>
                    </div>

                    {user ? (
                      <Button
                        variant="gradient"
                        className="gap-2 px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={handleCreatePost}
                        disabled={isSubmitting || createPost.isPending}
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

            {/* Search and Tabs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết hoặc hashtag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 rounded-2xl bg-card border-border shadow-sm focus:ring-primary/20"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 bg-card rounded-2xl border border-border p-1.5 shadow-sm w-full sm:w-auto">
                {[
                  { id: 'trending', label: 'Xu hướng', icon: Flame },
                  { id: 'latest', label: 'Mới nhất', icon: Clock },
                  { id: 'following', label: 'Đang theo dõi', icon: Heart },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 sm:flex-none sm:px-4 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-y-[-1px]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                    <span className={tab.id === 'following' ? 'hidden md:inline' : ''}>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <PostCardSkeleton key={i} />
                  ))}
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
