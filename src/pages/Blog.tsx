import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  ChevronRight,
  Bookmark,
  TrendingUp,
  Calendar,
  User,
  ArrowUpDown,
  Check,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import {
  useBlogPosts,
  useFeaturedBlogPosts,
  useSeries,
  BlogPost as IBlogPost,
  Series as ISeries,
  useLikeBlogPost,
  useUnlikeBlogPost,
  useIsBlogPostLiked,
  useBookmarkBlogPost,
  useUnbookmarkBlogPost,
  useIsBlogPostBookmarked
} from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const BlogCard: React.FC<{ post: IBlogPost }> = ({ post }) => {
  const { user } = useAuth();
  const { data: isLiked } = useIsBlogPostLiked(post.id);
  const { data: isBookmarked } = useIsBlogPostBookmarked(post.id);

  const likePost = useLikeBlogPost();
  const unlikePost = useUnlikeBlogPost();
  const bookmarkPost = useBookmarkBlogPost();
  const unbookmarkPost = useUnbookmarkBlogPost();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    if (isLiked) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu bài viết');
      return;
    }
    if (isBookmarked) {
      unbookmarkPost.mutate(post.id);
    } else {
      bookmarkPost.mutate(post.id);
    }
  };

  return (
    <article
      className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
    >
      {/* Thumbnail */}
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[2/1] bg-muted overflow-hidden">
          <img
            src={post.thumbnail_url || '/placeholder.svg'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {post.is_featured && (
            <Badge variant="gradient" className="absolute top-3 left-3">
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="absolute top-3 right-3">
            {post.category}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {post.author?.display_name?.[0].toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium">{post.author?.display_name || 'Người dùng'}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới'}
              <span>•</span>
              <Clock className="w-3 h-3" />
              {post.read_time_minutes} phút
            </div>
          </div>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 h-14">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 overflow-hidden h-6">
          {(post.tags || []).slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="tech" className="text-[10px] px-2">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 transition-colors hover:text-primary">
              <Eye className="w-4 h-4" />
              {(post.views_count || 0).toLocaleString()}
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'hover:text-primary'}`}
              disabled={likePost.isPending || unlikePost.isPending}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {(post.likes_count || 0).toLocaleString()}
            </button>
            <span className="flex items-center gap-1.5 transition-colors hover:text-primary">
              <MessageSquare className="w-4 h-4" />
              {(post.comments_count || 0).toLocaleString()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-lg ${isBookmarked ? 'text-primary bg-primary/10' : 'hover:text-primary hover:bg-primary/5'}`}
            onClick={handleBookmark}
            disabled={bookmarkPost.isPending || unbookmarkPost.isPending}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </article>
  );
};

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: blogPosts, isLoading: postsLoading } = useBlogPosts(selectedCategory, sortBy);
  const { data: featuredPosts, isLoading: featuredLoading } = useFeaturedBlogPosts();
  const { data: series, isLoading: seriesLoading } = useSeries();

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'devops', name: 'DevOps' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'ai-ml', name: 'AI/ML' },
  ];

  const filteredPosts = (blogPosts || []).filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blog & Bài viết</h1>
          <p className="text-muted-foreground">
            Khám phá kiến thức từ cộng đồng developer Việt Nam
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-[46px] rounded-lg">
                <Filter className="w-4 h-4" />
                Bộ lọc
                <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortBy('newest')}
                className="flex items-center justify-between"
              >
                Mới nhất
                {sortBy === 'newest' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('most_viewed')}
                className="flex items-center justify-between"
              >
                Xem nhiều nhất
                {sortBy === 'most_viewed' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('most_liked')}
                className="flex items-center justify-between"
              >
                Yêu thích nhất
                {sortBy === 'most_liked' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="gradient" className="gap-2 h-[46px] rounded-lg">
            <BookOpen className="w-4 h-4" />
            Viết bài mới
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Featured Series */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Series nổi bật</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 rounded-lg">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {seriesLoading ? (
              <div className="col-span-2 text-center py-12 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Đang tải series...</p>
              </div>
            ) : series?.length === 0 ? (
              <div className="col-span-2 text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
                <p className="text-muted-foreground">Chưa có series nào nổi bật</p>
              </div>
            ) : series?.map((item) => (
              <Link
                key={item.id}
                to={`/blog/series/${item.id}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-sm"
              >
                <div className="flex h-full">
                  <div className="w-1/3 aspect-square bg-muted flex-shrink-0">
                    <img
                      src={item.thumbnail_url || '/placeholder.svg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-center">
                    <Badge variant="gradient" className="mb-2 w-fit">Series</Badge>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">
                        {item.author?.display_name?.[0].toUpperCase() || 'A'}
                      </div>
                      {item.author?.display_name || 'Người dùng'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Bài viết mới nhất</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {postsLoading ? (
              <div className="col-span-2 text-center py-20 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Đang tải bài viết...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-2 text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
                <p className="text-muted-foreground">Không tìm thấy bài viết nào</p>
              </div>
            ) : filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="rounded-xl px-12 h-12 font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                Xem thêm bài viết
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
