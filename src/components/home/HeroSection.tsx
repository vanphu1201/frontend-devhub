import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Users, BookOpen, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatformStats } from '@/hooks/useStats';

const HeroSection: React.FC = () => {
  const { data: platformStats } = usePlatformStats();

  const stats = [
    {
      value: platformStats ? `${(platformStats.users_count >= 1000 ? (platformStats.users_count / 1000).toFixed(1) + 'K' : platformStats.users_count)}+` : '...',
      label: 'Lập trình viên'
    },
    {
      value: platformStats ? `${(platformStats.posts_count >= 1000 ? (platformStats.posts_count / 1000).toFixed(1) + 'K' : platformStats.posts_count)}+` : '...',
      label: 'Bài viết'
    },
    {
      value: platformStats ? `${platformStats.products_count}+` : '...',
      label: 'Sản phẩm'
    },
    {
      value: platformStats ? `${(platformStats.downloads_count >= 1000 ? (platformStats.downloads_count / 1000).toFixed(1) + 'K' : platformStats.downloads_count)}+` : '...',
      label: 'Lượt tải'
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero-pattern">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Nền tảng #1 cho Developer Việt Nam
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Kết nối, Học hỏi và
              <span className="block gradient-hero-text">Phát triển cùng nhau</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              DevHub là nền tảng kết hợp mạng xã hội, học thuật và thương mại dành riêng cho cộng đồng lập trình viên.
              Chia sẻ kiến thức, mua bán source code và xây dựng sự nghiệp của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register" className="flex items-center gap-2">
                  Bắt đầu miễn phí
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/marketplace">Khám phá Marketplace</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="glass rounded-2xl p-6 card-hover animate-float" style={{ animationDelay: '0s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Mạng xã hội</h3>
                <p className="text-sm text-muted-foreground">
                  Kết nối với developer, chia sẻ code và nhận feedback
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass rounded-2xl p-6 card-hover animate-float mt-8" style={{ animationDelay: '0.5s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Học thuật</h3>
                <p className="text-sm text-muted-foreground">
                  Blog, series bài viết và tài liệu chất lượng cao
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass rounded-2xl p-6 card-hover animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Marketplace</h3>
                <p className="text-sm text-muted-foreground">
                  Mua bán template, source code và ebook
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass rounded-2xl p-6 card-hover animate-float mt-8" style={{ animationDelay: '1.5s' }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Code Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Viết code với syntax highlighting và preview
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
