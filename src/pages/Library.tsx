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
  Video
} from 'lucide-react';
import { useResources } from '@/hooks/useResources';

const Library: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all');

  const { data: resources, isLoading: isLoadingResources } = useResources(activeTab);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Thư viện tài liệu</h1>
          <p className="text-muted-foreground">
            Tải xuống ebook, template, source code và nhiều tài liệu hữu ích khác
          </p>
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

                  {resource.is_premium && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}

                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {resource.category || 'Chung'}
                  </Badge>

                  {/* Preview Button */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {resource.file_url && (
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
                      <Button
                        variant={resource.is_premium ? "gradient" : "default"}
                        size="sm"
                        className="gap-1"
                        asChild
                      >
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                          {resource.is_premium ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              Mở khóa
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              Tải xuống
                            </>
                          )}
                        </a>
                      </Button>
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

