import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Github, 
  Twitter, 
  Linkedin,
  Settings,
  Edit,
  Users,
  FileText,
  MessageSquare,
  Award,
  TrendingUp,
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Download,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

const Profile: React.FC = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<'posts' | 'series' | 'products' | 'badges'>('posts');

  // Mock data
  const user = {
    name: 'Nguyễn Minh Đức',
    username: '@minhduc',
    avatar: 'M',
    bio: 'Full-stack developer | 5 năm kinh nghiệm | Yêu thích Node.js và React | Building @DevHub',
    location: 'Hà Nội, Việt Nam',
    website: 'https://minhduc.dev',
    joinDate: 'Tháng 3, 2022',
    reputation: 12500,
    rank: 1,
    followers: 2340,
    following: 156,
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Docker'],
    socials: {
      github: 'minhduc',
      twitter: 'minhduc_dev',
      linkedin: 'minhduc',
    },
    stats: {
      posts: 156,
      series: 8,
      products: 5,
      answers: 423,
      views: 125000,
      likes: 8900,
    },
    badges: [
      { name: 'JavaScript Expert', type: 'gold', icon: '⚡' },
      { name: 'Top Contributor', type: 'gold', icon: '🏆' },
      { name: 'Bug Hunter', type: 'silver', icon: '🐛' },
      { name: 'Mentor', type: 'silver', icon: '🎓' },
      { name: 'Early Adopter', type: 'bronze', icon: '🚀' },
      { name: '100 Posts', type: 'bronze', icon: '📝' },
    ],
    achievements: [
      { name: 'Streak 30 ngày', progress: 100, icon: '🔥' },
      { name: 'Nhận 1000 likes', progress: 89, icon: '❤️' },
      { name: 'Giúp đỡ 500 người', progress: 85, icon: '🤝' },
      { name: 'Viết 200 bài', progress: 78, icon: '✍️' },
    ],
  };

  const posts = [
    {
      id: 1,
      title: 'Hướng dẫn xây dựng REST API với Node.js và Express từ A-Z',
      excerpt: 'Bài viết chi tiết về cách thiết kế và triển khai REST API chuyên nghiệp...',
      tags: ['Node.js', 'Express', 'API'],
      createdAt: '2 ngày trước',
      views: 15420,
      likes: 892,
      comments: 156,
    },
    {
      id: 2,
      title: 'React Performance Optimization Tips',
      excerpt: 'Các kỹ thuật tối ưu hiệu suất cho ứng dụng React...',
      tags: ['React', 'Performance'],
      createdAt: '1 tuần trước',
      views: 8900,
      likes: 567,
      comments: 89,
    },
    {
      id: 3,
      title: 'TypeScript Best Practices 2024',
      excerpt: 'Tổng hợp các best practices khi sử dụng TypeScript...',
      tags: ['TypeScript', 'JavaScript'],
      createdAt: '2 tuần trước',
      views: 6700,
      likes: 432,
      comments: 67,
    },
  ];

  const products = [
    {
      id: 1,
      name: 'SaaS Dashboard Pro',
      price: 890000,
      rating: 4.9,
      sales: 234,
      image: '/placeholder.svg',
    },
    {
      id: 2,
      name: 'React Starter Kit',
      price: 0,
      rating: 4.7,
      sales: 567,
      image: '/placeholder.svg',
    },
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl sm:text-5xl font-bold text-primary-foreground border-4 border-background shadow-xl">
                  {user.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-lg border-2 border-background">
                  👑
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 mt-4 sm:mt-0 sm:mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="gold" className="gap-1">
                      <Trophy className="w-3 h-3" />
                      Rank #{user.rank}
                    </Badge>
                    <Badge variant="gradient">Pro Member</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground">{user.username}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 sm:mt-0 sm:mb-2">
                <Button variant="gradient">Theo dõi</Button>
                <Button variant="outline">Nhắn tin</Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Bio & Details */}
            <div className="mt-6 grid lg:grid-cols-[1fr_300px] gap-6">
              <div>
                <p className="text-foreground mb-4">{user.bio}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </span>
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <LinkIcon className="w-4 h-4" />
                    {user.website.replace('https://', '')}
                  </a>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tham gia {user.joinDate}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {user.socials.github && (
                    <a href={`https://github.com/${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {user.socials.twitter && (
                    <a href={`https://twitter.com/${user.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {user.socials.linkedin && (
                    <a href={`https://linkedin.com/in/${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="tech">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.reputation.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Điểm uy tín</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.followers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.following}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {user.stats.posts} bài viết
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    {user.stats.answers} trả lời
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {(user.stats.views / 1000).toFixed(0)}K lượt xem
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    {(user.stats.likes / 1000).toFixed(1)}K likes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 mb-6">
              {[
                { id: 'posts', label: 'Bài viết', icon: FileText },
                { id: 'series', label: 'Series', icon: Layers },
                { id: 'products', label: 'Sản phẩm', icon: ShoppingBag },
                { id: 'badges', label: 'Huy hiệu', icon: Award },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"
                  >
                    <Link to={`/blog/${post.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="tech" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/marketplace/${product.id}`}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-video bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className={product.price === 0 ? 'text-reputation font-medium' : 'text-primary font-bold'}>
                          {formatPrice(product.price)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Badges */}
            {activeTab === 'badges' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`bg-card rounded-xl border border-border p-5 text-center ${
                      badge.type === 'gold' ? 'border-yellow-500/30 bg-yellow-500/5' :
                      badge.type === 'silver' ? 'border-gray-400/30 bg-gray-400/5' :
                      'border-amber-600/30 bg-amber-600/5'
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold mb-1">{badge.name}</h4>
                    <Badge variant={badge.type as any} className="text-xs">
                      {badge.type.charAt(0).toUpperCase() + badge.type.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Thành tựu
              </h3>
              <div className="space-y-4">
                {user.achievements.map((achievement, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        {achievement.icon} {achievement.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Đăng bài viết mới', time: '2 giờ trước' },
                  { action: 'Trả lời câu hỏi', time: '5 giờ trước' },
                  { action: 'Nhận huy hiệu mới', time: '1 ngày trước' },
                  { action: 'Like bài viết', time: '2 ngày trước' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{activity.action}</span>
                    <span className="text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Add missing import
const Layers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

export default Profile;
