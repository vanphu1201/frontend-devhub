import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  FileCode,
  FileImage,
  Lock,
  Star,
  Clock,
  User,
  CheckCircle,
  PlayCircle,
  Loader2,
  Video,
  Coins,
  Unlock,
  ShoppingCart
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResources, useUnlockResource, useUserResourcePurchases } from '@/hooks/useResources';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Library: React.FC = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all');

  const { data: resources, isLoading: isLoadingResources } = useResources(activeTab);
  const { data: purchases } = useUserResourcePurchases();
  const unlockResource = useUnlockResource();

  const isUnlocked = (resourceId: string) => {
    return purchases?.some(p => p.resource_id === resourceId);
  };

  const handleUnlock = async (resourceId: string, points: number) => {
    if (!profile) {
      toast.error('Vui lòng đăng nhập để mở khóa tài liệu');
      return;
    }

    if ((profile.consumption_points || 0) < points) {
      toast.error(`Bạn không đủ điểm tiêu dùng. Cần ${points} điểm.`);
      return;
    }

    try {
      await unlockResource.mutateAsync(resourceId);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleBuyWithMoney = (resourceId: string, price: number) => {
    toast.info(`Tính năng thanh toán qua VNĐ (${price.toLocaleString()}đ) đang được bảo trì. Vui lòng mở khóa bằng điểm CP!`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'code':
        return FileCode;
      case 'image':
        return FileImage;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'from-red-500 to-rose-500';
      case 'code':
        return 'from-blue-500 to-cyan-500';
      case 'image':
        return 'from-purple-500 to-pink-500';
      case 'video':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredResources = resources?.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Thư viện tài liệu</h1>
            <p className="text-muted-foreground">
              Tải xuống ebook, template, source code và nhiều tài liệu hữu ích khác
            </p>
          </div>
          {profile && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Điểm tiêu dùng</div>
                <div className="text-xl font-bold text-primary">{(profile.consumption_points || 0).toLocaleString()} <span className="text-sm font-normal">CP</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-muted/50 rounded-xl p-1 w-fit">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'free', label: 'Miễn phí' },
            { id: 'premium', label: 'Premium' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingResources ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải tài liệu...</p>
            </div>
          ) : filteredResources?.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">Không tìm thấy tài liệu phù hợp</p>
            </div>
          ) : filteredResources?.map((resource, index) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Preview */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(resource.type)} opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TypeIcon className="w-16 h-16 text-muted-foreground/50" />
                  </div>

                  {resource.is_premium && !isUnlocked(resource.id) && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none shadow-lg">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}

                  {resource.is_premium && isUnlocked(resource.id) && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none shadow-lg">
                      <Unlock className="w-3 h-3 mr-1" />
                      Đã mở khóa
                    </Badge>
                  )}

                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {resource.category || 'Chung'}
                  </Badge>

                  {/* Preview Button */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {resource.file_url && (!resource.is_premium || isUnlocked(resource.id)) && (
                      <Button size="sm" variant="secondary" className="gap-1" asChild>
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {resource.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <User className="w-3.5 h-3.5" />
                    <span>{resource.author?.display_name || 'Admin'}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(resource.updated_at || resource.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm mb-4">
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      {resource.rating || '5.0'}
                    </span>
                    <span className="text-muted-foreground">
                      ({resource.reviews_count || 0} đánh giá)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {(resource.downloads_count || 0).toLocaleString()} lượt tải
                      </span>
                    </div>
                    {resource.file_url && (
                      <div className="flex gap-2">
                        {resource.is_premium && !isUnlocked(resource.id) ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="gradient"
                                size="sm"
                                className="gap-2 px-4 shadow-md"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                Mở khóa
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px] rounded-2xl">
                              <DialogHeader>
                                <DialogTitle>Mở khóa tài liệu</DialogTitle>
                                <DialogDescription>
                                  Chọn phương thức để sở hữu vĩnh viễn tài liệu này
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <Button
                                  onClick={() => handleUnlock(resource.id, resource.points_price || 0)}
                                  disabled={unlockResource.isPending}
                                  className="flex flex-col h-16 gap-0 bg-muted-foreground/10 hover:bg-primary/10 text-foreground border border-border"
                                  variant="outline"
                                >
                                  <div className="flex items-center gap-2 font-bold text-orange-500">
                                    <Coins className="w-4 h-4" />
                                    {resource.points_price?.toLocaleString()} CP
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">Thanh toán bằng điểm tích lũy</span>
                                </Button>

                                <Button
                                  onClick={() => handleBuyWithMoney(resource.id, resource.price || 0)}
                                  className="flex flex-col h-16 gap-0 bg-muted-foreground/10 hover:bg-accent/10 text-foreground border border-border"
                                  variant="outline"
                                >
                                  <div className="flex items-center gap-2 font-bold text-primary">
                                    <ShoppingCart className="w-4 h-4" />
                                    {resource.price?.toLocaleString()} VNĐ
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">Thanh toán qua ví điện tử / thẻ</span>
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button
                            variant={resource.is_premium ? "outline" : "default"}
                            size="sm"
                            className="gap-1 px-4"
                            asChild
                          >
                            <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3.5 h-3.5" />
                              Tải xuống
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Library;

