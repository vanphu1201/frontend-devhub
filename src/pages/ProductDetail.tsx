import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Star, 
  Download, 
  ShoppingCart, 
  Heart,
  Share2,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Clock,
  RefreshCw,
  Shield,
  MessageSquare,
  User,
  ExternalLink,
  Code,
  FileText,
  Layers
} from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews' | 'support'>('overview');

  // Mock data
  const product = {
    id: 1,
    name: 'SaaS Dashboard Pro',
    description: 'Template dashboard hoàn chỉnh cho ứng dụng SaaS với Next.js 14, TypeScript và Tailwind CSS. Bao gồm authentication, charts, tables, forms và nhiều components khác.',
    longDescription: `
## Giới thiệu

SaaS Dashboard Pro là template dashboard chuyên nghiệp được thiết kế đặc biệt cho các ứng dụng SaaS. Với hơn 100+ components được tối ưu, bạn có thể nhanh chóng xây dựng dashboard của riêng mình.

## Tính năng nổi bật

- **Authentication**: Đăng nhập, đăng ký, quên mật khẩu với NextAuth.js
- **Dashboard Pages**: 10+ trang dashboard khác nhau
- **Charts & Analytics**: Biểu đồ thống kê với Recharts
- **Data Tables**: Bảng dữ liệu với sorting, filtering, pagination
- **Dark Mode**: Hỗ trợ dark/light mode hoàn hảo
- **Responsive**: Tương thích tất cả thiết bị

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- NextAuth.js
- Recharts
    `,
    price: 890000,
    originalPrice: 1200000,
    rating: 4.9,
    reviews: 127,
    downloads: 2340,
    previewUrl: 'https://example.com/preview',
    demoUrl: 'https://example.com/demo',
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 'NextAuth.js', 'Recharts'],
    category: 'Dashboard',
    version: '2.1.0',
    lastUpdate: '10/01/2024',
    documentation: true,
    support: '6 tháng',
    author: {
      name: 'DevHub Team',
      avatar: 'D',
      verified: true,
      products: 15,
      rating: 4.8,
      sales: 12500,
    },
    features: [
      'Hơn 100+ components',
      'Authentication với NextAuth.js',
      '10+ trang dashboard',
      'Charts & Analytics',
      'Data Tables nâng cao',
      'Dark/Light mode',
      'Responsive design',
      'Clean code & Documentation',
      'Free updates 1 năm',
      'Support 6 tháng',
    ],
    screenshots: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
  };

  const reviews = [
    {
      id: 1,
      author: { name: 'Nguyễn Văn A', avatar: 'N' },
      rating: 5,
      content: 'Template rất đẹp và dễ customize. Documentation chi tiết, support nhanh chóng. Highly recommended!',
      createdAt: '5 ngày trước',
      helpful: 23,
    },
    {
      id: 2,
      author: { name: 'Trần Thị B', avatar: 'T' },
      rating: 5,
      content: 'Code sạch, cấu trúc rõ ràng. Đã sử dụng cho 3 dự án và rất hài lòng.',
      createdAt: '1 tuần trước',
      helpful: 18,
    },
    {
      id: 3,
      author: { name: 'Lê Văn C', avatar: 'L' },
      rating: 4,
      content: 'Nhìn chung rất tốt, chỉ có một số component cần customize thêm cho phù hợp với dự án.',
      createdAt: '2 tuần trước',
      helpful: 12,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/marketplace" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Marketplace
          </Link>
          <span>/</span>
          <span>{product.category}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div>
            {/* Preview Section */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
              {/* Preview Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  {[
                    { id: 'desktop', icon: Monitor, label: 'Desktop' },
                    { id: 'tablet', icon: Tablet, label: 'Tablet' },
                    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                  ].map((device) => (
                    <button
                      key={device.id}
                      onClick={() => setPreviewDevice(device.id as any)}
                      className={`p-2 rounded transition-colors ${
                        previewDevice === device.id
                          ? 'bg-background shadow text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title={device.label}
                    >
                      <device.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  </Button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="relative bg-muted aspect-[16/9] flex items-center justify-center">
                <div
                  className={`bg-background border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
                    previewDevice === 'desktop' ? 'w-full h-full' :
                    previewDevice === 'tablet' ? 'w-3/4 h-full' :
                    'w-1/3 h-full'
                  }`}
                >
                  <img
                    src={product.screenshots[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Screenshots */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 mb-6">
              {[
                { id: 'overview', label: 'Tổng quan' },
                { id: 'features', label: 'Tính năng' },
                { id: 'reviews', label: `Đánh giá (${product.reviews})` },
                { id: 'support', label: 'Hỗ trợ' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{product.longDescription}</div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                        {review.author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.author.name}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-500 fill-current' : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{review.createdAt}</span>
                          <button className="hover:text-primary transition-colors">
                            Hữu ích ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'support' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Hỗ trợ kỹ thuật</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn có câu hỏi về sản phẩm? Tạo ticket hỗ trợ và đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.
                </p>
                <Button variant="gradient" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Tạo Ticket Hỗ trợ
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} đánh giá)</span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  {product.downloads.toLocaleString()}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <Badge variant="destructive">
                    Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Mua ngay
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="lg" className="flex-1 gap-2">
                    <Heart className="w-4 h-4" />
                    Yêu thích
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </Button>
                </div>
              </div>

              {/* Product Meta */}
              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Phiên bản
                  </span>
                  <span className="font-medium">{product.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Cập nhật
                  </span>
                  <span className="font-medium">{product.lastUpdate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documentation
                  </span>
                  <Badge variant="success">Có</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Hỗ trợ
                  </span>
                  <span className="font-medium">{product.support}</span>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="py-4 border-b border-border">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {product.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.author.name}</span>
                      {product.author.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.author.products} sản phẩm • {product.author.sales.toLocaleString()} bán
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
