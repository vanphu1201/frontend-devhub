import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare,
  ChevronRight,
  Bookmark,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả', count: 1234 },
    { id: 'frontend', name: 'Frontend', count: 456 },
    { id: 'backend', name: 'Backend', count: 389 },
    { id: 'devops', name: 'DevOps', count: 234 },
    { id: 'mobile', name: 'Mobile', count: 178 },
    { id: 'ai-ml', name: 'AI/ML', count: 145 },
  ];

  const featuredSeries = [
    {
      id: 1,
      title: 'React từ Zero đến Hero',
      description: 'Khóa học React hoàn chỉnh từ cơ bản đến nâng cao',
      author: 'Nguyễn Minh Đức',
      totalParts: 15,
      completedParts: 12,
      thumbnail: '/placeholder.svg',
      tags: ['React', 'JavaScript', 'Frontend'],
    },
    {
      id: 2,
      title: 'Docker & Kubernetes Masterclass',
      description: 'Container hóa ứng dụng và orchestration với K8s',
      author: 'Lê Văn Thành',
      totalParts: 10,
      completedParts: 10,
      thumbnail: '/placeholder.svg',
      tags: ['Docker', 'Kubernetes', 'DevOps'],
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Hướng dẫn xây dựng REST API với Node.js và Express từ A-Z',
      excerpt: 'Bài viết chi tiết về cách thiết kế và triển khai REST API chuyên nghiệp với Node.js, Express, và MongoDB. Bao gồm authentication, validation, error handling...',
      author: {
        name: 'Nguyễn Văn A',
        avatar: 'N',
        reputation: 2500,
      },
      thumbnail: '/placeholder.svg',
      category: 'Backend',
      tags: ['Node.js', 'Express', 'API', 'MongoDB'],
      createdAt: '15/01/2024',
      readTime: '12 phút',
      views: 15420,
      likes: 892,
      comments: 156,
      isFeatured: true,
    },
    {
      id: 2,
      title: 'React 19: Những tính năng mới đáng chú ý',
      excerpt: 'Tổng hợp các tính năng mới trong React 19 và cách áp dụng vào dự án thực tế. Server Components, Actions, và nhiều hơn nữa...',
      author: {
        name: 'Trần Thị B',
        avatar: 'T',
        reputation: 1800,
      },
      thumbnail: '/placeholder.svg',
      category: 'Frontend',
      tags: ['React', 'JavaScript', 'Frontend'],
      createdAt: '14/01/2024',
      readTime: '8 phút',
      views: 12300,
      likes: 756,
      comments: 98,
      isFeatured: false,
    },
    {
      id: 3,
      title: 'Tối ưu performance cho ứng dụng Next.js',
      excerpt: 'Các kỹ thuật tối ưu hiệu suất cho Next.js application: Image optimization, code splitting, caching strategies...',
      author: {
        name: 'Lê Văn C',
        avatar: 'L',
        reputation: 3200,
      },
      thumbnail: '/placeholder.svg',
      category: 'Frontend',
      tags: ['Next.js', 'Performance', 'SEO'],
      createdAt: '13/01/2024',
      readTime: '15 phút',
      views: 9800,
      likes: 543,
      comments: 67,
      isFeatured: true,
    },
    {
      id: 4,
      title: 'Machine Learning cơ bản với Python và Scikit-learn',
      excerpt: 'Giới thiệu về Machine Learning và cách triển khai các mô hình cơ bản với Python và thư viện Scikit-learn...',
      author: {
        name: 'Phạm Văn D',
        avatar: 'P',
        reputation: 2100,
      },
      thumbnail: '/placeholder.svg',
      category: 'AI/ML',
      tags: ['Python', 'Machine Learning', 'Scikit-learn'],
      createdAt: '12/01/2024',
      readTime: '20 phút',
      views: 7650,
      likes: 423,
      comments: 45,
      isFeatured: false,
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blog & Bài viết</h1>
          <p className="text-muted-foreground">
            Khám phá kiến thức từ cộng đồng developer Việt Nam
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </Button>
          <Button variant="gradient" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Viết bài mới
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {cat.name}
              <span className="ml-2 text-xs opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Featured Series */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Series nổi bật</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredSeries.map((series) => (
              <Link
                key={series.id}
                to={`/blog/series/${series.id}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
              >
                <div className="flex">
                  <div className="w-1/3 aspect-square bg-muted">
                    <img
                      src={series.thumbnail}
                      alt={series.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <Badge variant="gradient" className="mb-2">Series</Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {series.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {series.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <User className="w-4 h-4" />
                      {series.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${(series.completedParts / series.totalParts) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {series.completedParts}/{series.totalParts}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Bài viết mới nhất</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[2/1] bg-muted overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.isFeatured && (
                    <Badge variant="gradient" className="absolute top-3 left-3">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {post.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {post.author.avatar}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{post.author.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt}
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>

                  <Link to={`/blog/${post.id}`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="tech" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Xem thêm bài viết
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
