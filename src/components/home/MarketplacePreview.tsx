import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Download, Eye, ShoppingCart, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useFeaturedProducts } from '@/hooks/useProducts';

const MarketplacePreview: React.FC = () => {
  const { data: products, isLoading } = useFeaturedProducts();

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
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
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border h-[400px] animate-pulse" />
            ))
          ) : products?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
              Chưa có sản phẩm nổi bật
            </div>
          ) : products?.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Preview Image */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {product.preview_images?.[0] ? (
                  <img
                    src={product.preview_images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <Monitor className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {product.is_featured && (
                  <Badge variant="gradient" className="absolute top-3 left-3">
                    Featured
                  </Badge>
                )}
                {product.original_price && product.original_price > product.price && (
                  <Badge variant="destructive" className="absolute top-3 right-3">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
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
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.tech_stack?.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{product.rating || 0}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviews_count || 0})</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Download className="w-3.5 h-3.5" />
                    {(product.downloads_count || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {formatPrice(product.original_price)}
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
