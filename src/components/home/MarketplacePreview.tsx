import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Download, Eye, ShoppingCart, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MarketplacePreview: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'SaaS Dashboard Pro',
      description: 'Template dashboard hoàn chỉnh cho ứng dụng SaaS với Next.js 14',
      price: 890000,
      originalPrice: 1200000,
      rating: 4.9,
      reviews: 127,
      downloads: 2340,
      image: '/placeholder.svg',
      techStack: ['Next.js', 'TypeScript', 'Tailwind'],
      isFeatured: true,
    },
    {
      id: 2,
      name: 'E-commerce Starter Kit',
      description: 'Bộ khởi đầu hoàn chỉnh cho website bán hàng online',
      price: 590000,
      originalPrice: null,
      rating: 4.7,
      reviews: 89,
      downloads: 1560,
      image: '/placeholder.svg',
      techStack: ['React', 'Node.js', 'MongoDB'],
      isFeatured: false,
    },
    {
      id: 3,
      name: 'Admin Template Ultimate',
      description: 'Template admin đa năng với 100+ components',
      price: 690000,
      originalPrice: 990000,
      rating: 4.8,
      reviews: 203,
      downloads: 3890,
      image: '/placeholder.svg',
      techStack: ['Vue.js', 'Vuetify', 'Firebase'],
      isFeatured: true,
    },
    {
      id: 4,
      name: 'Portfolio Creative',
      description: 'Template portfolio sáng tạo với animation mượt mà',
      price: 290000,
      originalPrice: null,
      rating: 4.6,
      reviews: 56,
      downloads: 890,
      image: '/placeholder.svg',
      techStack: ['React', 'Framer Motion', 'GSAP'],
      isFeatured: false,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-medium">Marketplace</span>
            </div>
            <h2 className="text-3xl font-bold">Sản phẩm bán chạy</h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/marketplace" className="flex items-center gap-2">
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Preview Image */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
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
                {product.originalPrice && (
                  <Badge variant="destructive" className="absolute top-3 right-3">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                )}
                
                {/* Quick Actions */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="gap-1">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>

                {/* Device Preview Icons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Monitor className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                  <Tablet className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                  <Smartphone className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <Link to={`/marketplace/${product.id}`}>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviews})</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Download className="w-3.5 h-3.5" />
                    {product.downloads.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/marketplace" className="flex items-center gap-2">
              Xem tất cả sản phẩm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;
