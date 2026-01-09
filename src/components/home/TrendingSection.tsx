import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Eye, Heart, MessageSquare, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TrendingSection: React.FC = () => {
  const trendingPosts = [
    {
      id: 1,
      title: 'Hướng dẫn xây dựng REST API với Node.js và Express từ A-Z',
      excerpt: 'Bài viết chi tiết về cách thiết kế và triển khai REST API chuyên nghiệp...',
      author: {
        name: 'Nguyễn Văn A',
        avatar: 'N',
        reputation: 2500,
      },
      tags: ['Node.js', 'Express', 'API'],
      views: 15420,
      likes: 892,
      comments: 156,
      readTime: '12 phút',
    },
    {
      id: 2,
      title: 'React 19: Những tính năng mới đáng chú ý',
      excerpt: 'Tổng hợp các tính năng mới trong React 19 và cách áp dụng...',
      author: {
        name: 'Trần Thị B',
        avatar: 'T',
        reputation: 1800,
      },
      tags: ['React', 'JavaScript', 'Frontend'],
      views: 12300,
      likes: 756,
      comments: 98,
      readTime: '8 phút',
    },
    {
      id: 3,
      title: 'Tối ưu performance cho ứng dụng Next.js',
      excerpt: 'Các kỹ thuật tối ưu hiệu suất cho Next.js application...',
      author: {
        name: 'Lê Văn C',
        avatar: 'L',
        reputation: 3200,
      },
      tags: ['Next.js', 'Performance', 'SEO'],
      views: 9800,
      likes: 543,
      comments: 67,
      readTime: '15 phút',
    },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPosts.map((post, index) => (
            <article
              key={post.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                    {post.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{post.author.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>⭐ {post.author.reputation.toLocaleString()} RP</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>

                <Link to={`/blog/${post.id}`}>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
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
                    {post.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

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
