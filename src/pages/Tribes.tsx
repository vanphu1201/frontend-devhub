import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Users, 
  MessageSquare, 
  FileText,
  Lock,
  Globe,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Tribes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'my-tribes'>('discover');

  const categories = [
    { id: 'all', name: 'Tất cả', count: 500 },
    { id: 'frontend', name: 'Frontend', count: 120 },
    { id: 'backend', name: 'Backend', count: 95 },
    { id: 'mobile', name: 'Mobile', count: 80 },
    { id: 'devops', name: 'DevOps', count: 65 },
    { id: 'ai-ml', name: 'AI/ML', count: 55 },
    { id: 'gamedev', name: 'Game Dev', count: 40 },
  ];

  const featuredTribes = [
    {
      id: 1,
      name: 'React Vietnam',
      description: 'Cộng đồng React lớn nhất Việt Nam. Chia sẻ kiến thức, thảo luận về React, Next.js và hệ sinh thái.',
      cover: '/placeholder.svg',
      avatar: '⚛️',
      members: 15420,
      posts: 8956,
      isPrivate: false,
      isFeatured: true,
      tags: ['React', 'Next.js', 'TypeScript'],
      admins: [
        { name: 'Minh Đức', avatar: 'M' },
        { name: 'Thu Hương', avatar: 'T' },
      ],
    },
    {
      id: 2,
      name: 'Node.js Developers VN',
      description: 'Dành cho các backend developer sử dụng Node.js, Express, NestJS. Thảo luận về architecture, best practices.',
      cover: '/placeholder.svg',
      avatar: '🟢',
      members: 12300,
      posts: 6543,
      isPrivate: false,
      isFeatured: true,
      tags: ['Node.js', 'Express', 'NestJS'],
      admins: [
        { name: 'Văn Thành', avatar: 'V' },
      ],
    },
  ];

  const tribes = [
    {
      id: 3,
      name: 'Python & Data Science VN',
      description: 'Cộng đồng về Python, Data Science, Machine Learning và AI',
      avatar: '🐍',
      members: 9800,
      posts: 4567,
      isPrivate: false,
      tags: ['Python', 'Data Science', 'AI'],
    },
    {
      id: 4,
      name: 'DevOps Vietnam',
      description: 'Docker, Kubernetes, CI/CD và Cloud Infrastructure',
      avatar: '🐳',
      members: 7650,
      posts: 3421,
      isPrivate: false,
      tags: ['Docker', 'Kubernetes', 'AWS'],
    },
    {
      id: 5,
      name: 'Flutter & Mobile Dev',
      description: 'Phát triển ứng dụng mobile với Flutter và React Native',
      avatar: '📱',
      members: 6540,
      posts: 2890,
      isPrivate: false,
      tags: ['Flutter', 'React Native', 'Mobile'],
    },
    {
      id: 6,
      name: 'System Design Interview',
      description: 'Chuẩn bị phỏng vấn System Design cho FAANG và big tech',
      avatar: '🏗️',
      members: 5430,
      posts: 1876,
      isPrivate: true,
      tags: ['System Design', 'Interview', 'FAANG'],
    },
    {
      id: 7,
      name: 'Vue.js Vietnam',
      description: 'Vue.js, Nuxt.js và hệ sinh thái Vue',
      avatar: '💚',
      members: 4320,
      posts: 1654,
      isPrivate: false,
      tags: ['Vue.js', 'Nuxt.js', 'JavaScript'],
    },
    {
      id: 8,
      name: 'Game Dev Vietnam',
      description: 'Unity, Unreal Engine và phát triển game indie',
      avatar: '🎮',
      members: 3210,
      posts: 987,
      isPrivate: false,
      tags: ['Unity', 'Unreal', 'Game Dev'],
    },
  ];

  const myTribes = [
    {
      id: 1,
      name: 'React Vietnam',
      avatar: '⚛️',
      members: 15420,
      unreadPosts: 12,
      role: 'member',
    },
    {
      id: 3,
      name: 'Python & Data Science VN',
      avatar: '🐍',
      members: 9800,
      unreadPosts: 5,
      role: 'moderator',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tribes</h1>
            <p className="text-muted-foreground">
              Tham gia các nhóm theo chủ đề và công nghệ bạn yêu thích
            </p>
          </div>
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo Tribe mới
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1 w-fit mb-8">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'discover'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Khám phá
          </button>
          <button
            onClick={() => setActiveTab('my-tribes')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'my-tribes'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tribes của tôi
          </button>
        </div>

        {activeTab === 'discover' && (
          <>
            {/* Search */}
            <div className="relative max-w-md mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm tribes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Featured Tribes */}
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Tribes nổi bật</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredTribes.map((tribe) => (
                  <div
                    key={tribe.id}
                    className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
                  >
                    {/* Cover */}
                    <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="absolute -bottom-8 left-6">
                        <div className="w-16 h-16 rounded-xl bg-card border-4 border-card flex items-center justify-center text-3xl shadow-lg">
                          {tribe.avatar}
                        </div>
                      </div>
                      {tribe.isPrivate && (
                        <Badge className="absolute top-3 right-3 gap-1">
                          <Lock className="w-3 h-3" />
                          Private
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-12">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {tribe.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tribe.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {tribe.tags.map((tag) => (
                          <Badge key={tag} variant="tech" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {tribe.members.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {tribe.posts.toLocaleString()} bài
                          </span>
                        </div>
                        <Button variant="gradient" size="sm">
                          Tham gia
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* All Tribes */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Tất cả Tribes</h2>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tribes.map((tribe, index) => (
                  <div
                    key={tribe.id}
                    className="group bg-card rounded-xl border border-border p-5 card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                        {tribe.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {tribe.name}
                          </h3>
                          {tribe.isPrivate && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {tribe.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {tribe.members.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {tribe.posts.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Tham gia
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'my-tribes' && (
          <div className="space-y-4">
            {myTribes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Chưa tham gia tribe nào</h3>
                <p className="text-muted-foreground mb-4">
                  Khám phá và tham gia các tribes để kết nối với cộng đồng
                </p>
                <Button variant="gradient" onClick={() => setActiveTab('discover')}>
                  Khám phá Tribes
                </Button>
              </div>
            ) : (
              myTribes.map((tribe) => (
                <Link
                  key={tribe.id}
                  to={`/tribes/${tribe.id}`}
                  className="flex items-center gap-4 bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl">
                    {tribe.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{tribe.name}</h3>
                      {tribe.role === 'moderator' && (
                        <Badge variant="gold" className="text-xs">Mod</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tribe.members.toLocaleString()} thành viên
                    </p>
                  </div>
                  {tribe.unreadPosts > 0 && (
                    <Badge variant="destructive">{tribe.unreadPosts} mới</Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tribes;
