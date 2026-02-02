import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Layers,
  Loader2,
  Copy,
  ExternalLink as ExternalLinkIcon,
  Heart as HeartIcon
} from 'lucide-react';
import { useProduct, usePurchaseProduct, useHasPurchased, useProductReviews, useAddReview } from '@/hooks/useProducts';
import { useCreateTicket } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ContentRenderer from '@/components/ui/ContentRenderer';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: hasPurchased } = useHasPurchased(id || '');
  const purchaseProduct = usePurchaseProduct();

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews' | 'support'>('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { data: reviews = [] } = useProductReviews(id || '');
  const addReview = useAddReview();

  // Support state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportPriority, setSupportPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const createTicket = useCreateTicket();

  const mainImage = selectedImage || (product?.preview_images?.[0] || '/placeholder.svg');

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để mua sản phẩm');
      return;
    }
    if (product) {
      if (product.price === 0 || hasPurchased) {
        toast.success('Bắt đầu tải về sản phẩm...');
        return;
      }
      await purchaseProduct.mutateAsync({ productId: product.id, price: product.price });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: url,
      }).catch(() => {
        navigator.clipboard.writeText(url);
        toast.success('Đã sao chép liên kết vào bộ nhớ tạm');
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết vào bộ nhớ tạm');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
          <Button asChild>
            <Link to="/marketplace">Quay lại Marketplace</Link>
          </Button>
        </div>
      </Layout>
    );
  }



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
                      className={`p-2 rounded transition-colors ${previewDevice === device.id
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
                    <a href={product.demo_url || '#'} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  </Button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="relative bg-muted/50 aspect-[16/9] flex items-center justify-center p-8 overflow-hidden group/preview">
                <div
                  className={`bg-background border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform ${previewDevice === 'desktop' ? 'w-full h-full' :
                    previewDevice === 'tablet' ? 'w-[75%] h-full' :
                      'w-[35%] h-full'
                    }`}
                >
                  <div className="h-6 bg-muted/30 border-b border-border flex items-center gap-1.5 px-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="relative w-full h-[calc(100%-24px)] overflow-y-auto custom-scrollbar">
                    <img
                      src={mainImage}
                      alt="Preview"
                      className="w-full h-auto object-cover animate-gentle-reveal"
                    />
                  </div>
                </div>
              </div>

              {/* Screenshots */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.preview_images?.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(screenshot)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${mainImage === screenshot ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
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
                { id: 'reviews', label: `Đánh giá (${reviews.length || product.reviews_count || 0})` },
                { id: 'support', label: 'Hỗ trợ & Hỏi đáp' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <div className="fade-in">
                  <ContentRenderer content={product.long_description || product.description} />
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid sm:grid-cols-2 gap-4 fade-in">
                  {product.tech_stack?.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6 fade-in">
                  {/* Write a review */}
                  {user && hasPurchased ? (
                    <div className="bg-card rounded-xl border border-border p-6 mb-8">
                      <h3 className="text-lg font-bold mb-4">Viết đánh giá</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Số sao (1-5)</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-muted'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comment">Nhận xét của bạn</Label>
                          <Textarea
                            id="comment"
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="rounded-xl min-h-[100px]"
                          />
                        </div>
                        <Button
                          variant="gradient"
                          onClick={() => {
                            if (!comment.trim()) {
                              toast.error('Vui lòng nhập nhận xét');
                              return;
                            }
                            addReview.mutate({ productId: id!, rating, comment }, {
                              onSuccess: () => setComment('')
                            });
                          }}
                          disabled={addReview.isPending}
                        >
                          {addReview.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>
                      </div>
                    </div>
                  ) : user && (
                    <div className="bg-muted/30 rounded-xl p-6 mb-8 text-center border border-dashed border-border">
                      <p className="text-muted-foreground text-sm">
                        Bạn cần sở hữu sản phẩm này để có thể để lại đánh giá.
                      </p>
                    </div>
                  )}

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-card rounded-xl border border-border p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                              {review.author?.avatar_url ? (
                                <img src={review.author.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                              ) : (
                                review.author?.display_name?.[0]?.toUpperCase() || 'U'
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.author?.display_name || 'Người dùng'}</span>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-muted'
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                {review.comment}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                      <Star className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'support' && (
                <div className="space-y-6 fade-in">
                  <div className="bg-card rounded-xl border border-border p-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">Hỗ trợ kỹ thuật</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-center">
                      Bạn có câu hỏi hoặc gặp lỗi khi sử dụng sản phẩm? Hãy tạo ticket hỗ trợ, đội ngũ của chúng tôi sẽ phản hồi sớm nhất.
                    </p>

                    <div className="max-w-xl mx-auto space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="support_subject">Tiêu đề</Label>
                        <Input
                          id="support_subject"
                          placeholder="Vấn đề bạn đang gặp phải..."
                          value={supportSubject}
                          onChange={(e) => setSupportSubject(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Mức độ ưu tiên</Label>
                          <Select
                            value={supportPriority}
                            onValueChange={(v: any) => setSupportPriority(v)}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Chọn mức độ" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="low">Thấp</SelectItem>
                              <SelectItem value="medium">Trung bình</SelectItem>
                              <SelectItem value="high">Cao</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support_message">Nội dung chi tiết</Label>
                        <Textarea
                          id="support_message"
                          placeholder="Mô tả chi tiết vấn đề của bạn..."
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          className="rounded-xl min-h-[120px]"
                        />
                      </div>
                      <Button
                        variant="gradient"
                        size="lg"
                        className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20"
                        onClick={() => {
                          if (!supportSubject.trim() || !supportMessage.trim()) {
                            toast.error('Vui lòng điền đầy đủ thông tin');
                            return;
                          }
                          createTicket.mutate({
                            subject: supportSubject,
                            message: supportMessage,
                            product_id: id,
                            priority: supportPriority
                          }, {
                            onSuccess: () => {
                              setSupportSubject('');
                              setSupportMessage('');
                            }
                          });
                        }}
                        disabled={createTicket.isPending}
                      >
                        {createTicket.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                        Gửi yêu cầu hỗ trợ
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-8">
                        Hoặc theo dõi các yêu cầu đã gửi tại <Link to="/dashboard" className="text-primary hover:underline font-medium">Dashboard</Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{product.rating || 0}</span>
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline text-sm"
                >
                  ({reviews.length || product.reviews_count || 0}) đánh giá
                </button>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  {(product.downloads_count || 0).toLocaleString()}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                {product.original_price && product.original_price > product.price && (
                  <Badge variant="destructive">
                    Tiết kiệm {formatPrice(product.original_price - product.price)}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <Button variant="hero" size="lg" className="w-full gap-2" onClick={handlePurchase} disabled={hasPurchased}>
                  <ShoppingCart className="w-5 h-5" />
                  {hasPurchased ? 'Đã sở hữu' : product.price === 0 ? 'Tải về miễn phí' : 'Mua ngay'}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className={`flex-1 gap-2 rounded-xl transition-all ${isFavorite ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Đã thích' : 'Yêu thích'}
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 gap-2 rounded-xl" onClick={handleShare}>
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
                  <span className="font-medium">{product.version || '1.0.0'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Cập nhật
                  </span>
                  <span className="font-medium">{new Date(product.updated_at || product.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Tài liệu (Docs)
                  </span>
                  {product.documentation_url ? (
                    <a href={product.documentation_url} target="_blank" rel="noopener noreferrer">
                      <Badge variant="success" className="cursor-pointer hover:bg-emerald-600 transition-colors">Xem ngay</Badge>
                    </a>
                  ) : (
                    <Badge variant="secondary">Không có</Badge>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('support')}
                  className="flex items-center justify-between text-sm w-full hover:bg-muted/50 p-1.5 -mx-1.5 rounded-lg transition-colors group"
                >
                  <span className="text-muted-foreground flex items-center gap-2 group-hover:text-primary">
                    <Shield className="w-4 h-4" />
                    Hỗ trợ
                  </span>
                  <span className="font-medium">{product.support_duration || '6 tháng'}</span>
                </button>
              </div>

              {/* Tech Stack */}
              <div className="py-4 border-b border-border">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tech_stack?.map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="pt-4">
                <div className="flex items-center gap-3">
                  {product.author?.avatar_url ? (
                    <img src={product.author.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {product.author?.display_name?.[0]?.toUpperCase() || 'A'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.author?.display_name || 'Admin'}</span>
                      {(product.author?.reputation ?? 0) > 1000 && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      {product.author?.reputation || 0} điểm uy tín
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
