import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
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
  Heart,
  Loader2
} from 'lucide-react';
import { ProductCardSkeleton } from '@/components/shared/Skeletons';
import { useProducts, Product } from '@/hooks/useProducts';

const ProductCard: React.FC<{ product: Product; viewMode: 'grid' | 'list'; index: number }> = ({
  product,
  viewMode,
  index
}) => {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getAuthorInitial = () => {
    if (product.author?.display_name) return product.author.display_name[0].toUpperCase();
    if (product.author?.username) return product.author.username[0].toUpperCase();
    return 'U';
  };

  const getAuthorName = () => {
    return product.author?.display_name || product.author?.username || 'Người dùng';
  };

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div
      className={`group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in ${viewMode === 'list' ? 'flex' : ''
        }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Preview Image */}
      <div className={`relative bg-muted overflow-hidden ${viewMode === 'list' ? 'w-72 flex-shrink-0' : 'aspect-[4/3]'}`}>
        {product.preview_images && product.preview_images.length > 0 ? (
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
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            -{discount}%
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

        <Link to={`/profile/${product.author?.username || product.user_id}`} className="flex items-center gap-2 mb-3 group/author">
          {product.author?.avatar_url ? (
            <img
              src={product.author.avatar_url}
              alt={getAuthorName()}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {getAuthorInitial()}
            </div>
          )}
          <span className="text-sm text-muted-foreground group-hover/author:text-primary transition-colors">{getAuthorName()}</span>
          {(product.author?.reputation ?? 0) > 1000 && (
            <Badge variant="secondary" className="text-xs">Verified</Badge>
          )}
        </Link>

        {product.tech_stack && product.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tech_stack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {product.tech_stack.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tech_stack.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-sm mb-4">
          <span className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            {product.rating || 0}
          </span>
          <span className="text-muted-foreground">
            ({product.reviews_count || 0})
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Download className="w-3.5 h-3.5" />
            {(product.downloads_count || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className={`text-lg font-bold ${product.price === 0 ? 'text-reputation' : 'text-primary'}`}>
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <Button variant="gradient" size="sm" className="gap-1" asChild>
            <Link to={`/marketplace/${product.id}`}>
              <ShoppingCart className="w-4 h-4" />
              {product.price === 0 ? 'Tải về' : 'Mua ngay'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'bestseller' | 'price-asc' | 'price-desc'>('newest');

  const { data: products, isLoading, error } = useProducts(selectedCategory === 'all' ? undefined : selectedCategory);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Dashboard', name: 'Dashboard' },
    { id: 'Landing Page', name: 'Landing Page' },
    { id: 'E-commerce', name: 'E-commerce' },
    { id: 'Admin Panel', name: 'Admin Panel' },
    { id: 'Portfolio', name: 'Portfolio' },
    { id: 'Blog', name: 'Blog' },
    { id: 'Mobile App', name: 'Mobile App' },
  ];

  // Filter products based on search and price
  const filteredProducts = products?.filter((product) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDesc = product.description.toLowerCase().includes(query);
      const matchesTech = product.tech_stack?.some(t => t.toLowerCase().includes(query));
      if (!matchesName && !matchesDesc && !matchesTech) return false;
    }

    return true;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'bestseller':
        return (b.downloads_count || 0) - (a.downloads_count || 0);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('newest');
  };

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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    <span>{cat.name}</span>
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
              <select
                className="text-sm bg-transparent border-none outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Mới nhất</option>
                <option value="bestseller">Bán chạy nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                Lỗi tải sản phẩm: {error.message}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {sortedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-lg mb-2">Chưa có sản phẩm nào</p>
                <p className="text-sm mb-4">
                  {searchQuery || selectedCategory !== 'all' || priceRange !== 'all'
                    ? 'Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại'
                    : 'Hãy là người đầu tiên đăng bán sản phẩm!'
                  }
                </p>
                {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all') && (
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
