import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  ShoppingCart,
  Monitor,
  Tablet,
  Smartphone,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart
} from 'lucide-react';

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'paid'>('all');

  const categories = [
    { id: 'all', name: 'Tất cả', count: 500 },
    { id: 'dashboard', name: 'Dashboard', count: 120 },
    { id: 'landing', name: 'Landing Page', count: 95 },
    { id: 'ecommerce', name: 'E-commerce', count: 80 },
    { id: 'admin', name: 'Admin Panel', count: 75 },
    { id: 'portfolio', name: 'Portfolio', count: 60 },
    { id: 'blog', name: 'Blog', count: 45 },
    { id: 'mobile', name: 'Mobile App', count: 35 },
  ];

  const products = [
    {
      id: 1,
      name: 'SaaS Dashboard Pro',
      description: 'Template dashboard hoàn chỉnh cho ứng dụng SaaS với Next.js 14, TypeScript và Tailwind CSS',
      price: 890000,
      originalPrice: 1200000,
      rating: 4.9,
      reviews: 127,
      downloads: 2340,
      image: '/placeholder.svg',
      techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma'],
      category: 'Dashboard',
      author: {
        name: 'DevHub Team',
        avatar: 'D',
        verified: true,
      },
      isFeatured: true,
      isNew: false,
    },
    {
      id: 2,
      name: 'E-commerce Starter Kit',
      description: 'Bộ khởi đầu hoàn chỉnh cho website bán hàng online với giỏ hàng, thanh toán và quản lý đơn hàng',
      price: 590000,
      originalPrice: null,
      rating: 4.7,
      reviews: 89,
      downloads: 1560,
      image: '/placeholder.svg',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'E-commerce',
      author: {
        name: 'Nguyễn Minh Đức',
        avatar: 'N',
        verified: true,
      },
      isFeatured: false,
      isNew: true,
    },
    {
      id: 3,
      name: 'Admin Template Ultimate',
      description: 'Template admin đa năng với 100+ components, charts, tables và nhiều tính năng khác',
      price: 690000,
      originalPrice: 990000,
      rating: 4.8,
      reviews: 203,
      downloads: 3890,
      image: '/placeholder.svg',
      techStack: ['Vue.js', 'Vuetify', 'Firebase'],
      category: 'Admin Panel',
      author: {
        name: 'Trần Thị Hương',
        avatar: 'T',
        verified: true,
      },
      isFeatured: true,
      isNew: false,
    },
    {
      id: 4,
      name: 'Portfolio Creative',
      description: 'Template portfolio sáng tạo với animation mượt mà, dark mode và responsive hoàn hảo',
      price: 290000,
      originalPrice: null,
      rating: 4.6,
      reviews: 56,
      downloads: 890,
      image: '/placeholder.svg',
      techStack: ['React', 'Framer Motion', 'GSAP'],
      category: 'Portfolio',
      author: {
        name: 'Lê Văn Thành',
        avatar: 'L',
        verified: false,
      },
      isFeatured: false,
      isNew: true,
    },
    {
      id: 5,
      name: 'Blog Platform Template',
      description: 'Template blog với CMS tích hợp, SEO optimized và hỗ trợ MDX',
      price: 0,
      originalPrice: null,
      rating: 4.5,
      reviews: 234,
      downloads: 5670,
      image: '/placeholder.svg',
      techStack: ['Next.js', 'MDX', 'Contentlayer'],
      category: 'Blog',
      author: {
        name: 'DevHub Team',
        avatar: 'D',
        verified: true,
      },
      isFeatured: false,
      isNew: false,
    },
    {
      id: 6,
      name: 'Landing Page Builder',
      description: 'Bộ components landing page với 50+ sections có thể tái sử dụng',
      price: 450000,
      originalPrice: 600000,
      rating: 4.8,
      reviews: 167,
      downloads: 2100,
      image: '/placeholder.svg',
      techStack: ['React', 'Tailwind', 'Headless UI'],
      category: 'Landing Page',
      author: {
        name: 'Phạm Văn D',
        avatar: 'P',
        verified: true,
      },
      isFeatured: true,
      isNew: false,
    },
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory) {
      return false;
    }
    if (priceRange === 'free' && product.price !== 0) return false;
    if (priceRange === 'paid' && product.price === 0) return false;
    return true;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Khám phá và mua các template, source code chất lượng cao
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="px-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary outline-none"
            >
              <option value="all">Tất cả giá</option>
              <option value="free">Miễn phí</option>
              <option value="paid">Có phí</option>
            </select>
            
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc
            </Button>

            <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-background shadow' : ''}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-background shadow' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Danh mục</h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs">{cat.count}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>
              <select className="text-sm bg-transparent border-none outline-none">
                <option>Mới nhất</option>
                <option>Bán chạy nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>

            <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Preview Image */}
                  <div className={`relative bg-muted overflow-hidden ${viewMode === 'list' ? 'w-72 flex-shrink-0' : 'aspect-[4/3]'}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {product.isFeatured && (
                      <Badge variant="gradient" className="absolute top-3 left-3">
                        Featured
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="info" className="absolute top-3 left-3">
                        Mới
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="gap-1" asChild>
                        <Link to={`/marketplace/${product.id}`}>
                          <Eye className="w-4 h-4" />
                          Preview
                        </Link>
                      </Button>
                    </div>

                    {/* Device Preview */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Monitor className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                      <Tablet className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                      <Smartphone className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link to={`/marketplace/${product.id}`}>
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-semibold">
                        {product.author.avatar}
                      </div>
                      <span className="text-sm text-muted-foreground">{product.author.name}</span>
                      {product.author.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.techStack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {product.techStack.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.techStack.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm mb-4">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        {product.rating}
                      </span>
                      <span className="text-muted-foreground">
                        ({product.reviews})
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Download className="w-3.5 h-3.5" />
                        {product.downloads.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-lg font-bold ${product.price === 0 ? 'text-reputation' : 'text-primary'}`}>
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Button variant="gradient" size="sm" className="gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        {product.price === 0 ? 'Tải về' : 'Mua ngay'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Xem thêm sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
