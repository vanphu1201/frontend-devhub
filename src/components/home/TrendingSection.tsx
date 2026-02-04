import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Eye, Heart, MessageSquare, Bookmark, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostCardSkeleton } from '@/components/shared/Skeletons';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const TrendingSection: React.FC = () => {
  const { data: trendingPosts, isLoading } = useBlogPosts(undefined, 'most_liked');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const postsToShow = (trendingPosts || []).slice(0, 3);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Trending</span>
            </div>
            <h2 className="text-3xl font-bold">Bài viết nổi bật</h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/blog" className="flex items-center gap-2">
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {postsToShow.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
            Chưa có bài viết nổi bật nào
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsToShow.map((post, index) => (
              <article
                key={post.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Link to={`/profile/${post.author?.username || post.author_id}`} className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold overflow-hidden">
                        {post.author?.avatar_url ? (
                          <img src={post.author.avatar_url} alt={post.author.display_name || post.author.username || ''} className="w-full h-full object-cover" />
                        ) : (
                          (post.author?.display_name || post.author?.username || 'U')[0].toUpperCase()
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${post.author?.username || post.author_id}`} className="font-medium text-sm hover:text-primary transition-colors">
                        {post.author?.display_name || post.author?.username || 'Anonymous'}
                      </Link>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>⭐ {(post.author?.reputation || 0).toLocaleString()} RP</span>
                        <span>•</span>
                        <span>{post.read_time_minutes} phút</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="tech">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {(post.views_count || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {(post.likes_count || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments_count || 0}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/blog" className="flex items-center gap-2">
              Xem tất cả bài viết
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
