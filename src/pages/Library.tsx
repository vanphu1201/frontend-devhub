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
  PlayCircle
} from 'lucide-react';

const Library: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all');

  const resources = [
    {
      id: 1,
      title: 'React Cheatsheet 2024',
      description: 'Tổng hợp các hooks, patterns và best practices trong React',
      type: 'pdf',
      category: 'Frontend',
      author: 'DevHub Team',
      downloads: 5420,
      rating: 4.9,
      reviews: 234,
      isPremium: false,
      size: '2.5 MB',
      pages: 15,
      updatedAt: '10/01/2024',
    },
    {
      id: 2,
      title: 'Node.js Production Guide',
      description: 'Hướng dẫn deploy và scale Node.js application',
      type: 'pdf',
      category: 'Backend',
      author: 'Nguyễn Minh Đức',
      downloads: 3210,
      rating: 4.8,
      reviews: 156,
      isPremium: true,
      size: '8.2 MB',
      pages: 45,
      updatedAt: '08/01/2024',
    },
    {
      id: 3,
      title: 'TypeScript Starter Template',
      description: 'Template dự án TypeScript với ESLint, Prettier đã cấu hình',
      type: 'code',
      category: 'Frontend',
      author: 'Trần Thị Hương',
      downloads: 2890,
      rating: 4.7,
      reviews: 98,
      isPremium: false,
      size: '156 KB',
      updatedAt: '05/01/2024',
    },
    {
      id: 4,
      title: 'Docker & K8s Infographics',
      description: 'Bộ hình ảnh minh họa về Docker và Kubernetes',
      type: 'image',
      category: 'DevOps',
      author: 'Lê Văn Thành',
      downloads: 1560,
      rating: 4.6,
      reviews: 67,
      isPremium: false,
      size: '12.4 MB',
      images: 24,
      updatedAt: '03/01/2024',
    },
    {
      id: 5,
      title: 'System Design Interview Guide',
      description: 'Ebook hướng dẫn chuẩn bị phỏng vấn System Design',
      type: 'pdf',
      category: 'Career',
      author: 'DevHub Team',
      downloads: 4567,
      rating: 4.9,
      reviews: 312,
      isPremium: true,
      size: '15.8 MB',
      pages: 120,
      updatedAt: '01/01/2024',
    },
    {
      id: 6,
      title: 'AI/ML Roadmap 2024',
      description: 'Lộ trình học AI/Machine Learning chi tiết',
      type: 'pdf',
      category: 'AI/ML',
      author: 'Phạm Văn D',
      downloads: 2340,
      rating: 4.8,
      reviews: 145,
      isPremium: false,
      size: '3.2 MB',
      pages: 25,
      updatedAt: '28/12/2023',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'code':
        return FileCode;
      case 'image':
        return FileImage;
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
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredResources = resources.filter((resource) => {
    if (activeTab === 'free') return !resource.isPremium;
    if (activeTab === 'premium') return resource.isPremium;
    return true;
  });

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
            { id: 'all', label: 'Tất cả', count: resources.length },
            { id: 'free', label: 'Miễn phí', count: resources.filter(r => !r.isPremium).length },
            { id: 'premium', label: 'Premium', count: resources.filter(r => r.isPremium).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => {
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
                  
                  {resource.isPremium && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}

                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {resource.category}
                  </Badge>

                  {/* Preview Button */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Eye className="w-4 h-4" />
                      Xem trước
                    </Button>
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
                    <span>{resource.author}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{resource.updatedAt}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm mb-4">
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      {resource.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({resource.reviews} đánh giá)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads.toLocaleString()} lượt tải
                      </span>
                    </div>
                    <Button 
                      variant={resource.isPremium ? "gradient" : "default"} 
                      size="sm"
                      className="gap-1"
                    >
                      {resource.isPremium ? (
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
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiz Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <Badge variant="gradient" className="mb-4">Mới</Badge>
            <h2 className="text-2xl font-bold mb-2">Kiểm tra kiến thức</h2>
            <p className="text-muted-foreground">
              Làm bài quiz để đánh giá và củng cố kiến thức của bạn
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'JavaScript Fundamentals', questions: 30, time: '15 phút', level: 'Cơ bản' },
              { title: 'React Hooks Deep Dive', questions: 25, time: '20 phút', level: 'Trung bình' },
              { title: 'System Design Basics', questions: 20, time: '30 phút', level: 'Nâng cao' },
            ].map((quiz, index) => (
              <div
                key={quiz.title}
                className="bg-card rounded-2xl border border-border p-6 card-hover"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge 
                    variant={
                      quiz.level === 'Cơ bản' ? 'success' :
                      quiz.level === 'Trung bình' ? 'warning' : 'destructive'
                    }
                  >
                    {quiz.level}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{quiz.questions} câu hỏi</span>
                  <span>•</span>
                  <span>{quiz.time}</span>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Bắt đầu làm bài
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Library;
