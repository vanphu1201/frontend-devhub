import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  const benefits = [
    'Miễn phí mãi mãi cho tính năng cơ bản',
    'Không giới hạn bài viết và bình luận',
    'Tham gia không giới hạn các nhóm',
    'Kiếm tiền từ bán sản phẩm của bạn',
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Bắt đầu miễn phí ngay hôm nay
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Sẵn sàng tham gia cộng đồng
          <span className="block gradient-hero-text mt-2">developer lớn nhất Việt Nam?</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Đăng ký ngay để kết nối với hàng nghìn lập trình viên, chia sẻ kiến thức và phát triển sự nghiệp của bạn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button variant="hero" size="xl" asChild>
            <Link to="/register" className="flex items-center gap-2">
              Đăng ký miễn phí
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link to="/about">Tìm hiểu thêm</Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-reputation" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
