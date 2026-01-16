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
  Users,
  FileText,
  MessageSquare,
  Award,
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Trophy,
  Target,
  Zap,
  Layers as LayersIcon,
  Loader2,
  Edit
} from 'lucide-react';
import { useProfile, useIsFollowing, useFollowUser, useUnfollowUser } from '@/hooks/useProfile';
import { useUserPosts, Post } from '@/hooks/usePosts';
import { useUserProducts, Product } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const Profile: React.FC = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'series' | 'products' | 'badges'>('posts');
  
  // Determine if viewing own profile or someone else's
  const profileUserId = username || currentUser?.id;
  
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(profileUserId);
  const { data: isFollowing } = useIsFollowing(profileUserId || '');
  const { data: userPosts, isLoading: postsLoading } = useUserPosts(profileUserId || '');
  const { data: userProducts, isLoading: productsLoading } = useUserProducts(profileUserId || '');
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  
  const isOwnProfile = currentUser?.id === profileUserId;

  const handleFollowToggle = () => {
    if (!profileUserId) return;
    if (isFollowing) {
      unfollowUser.mutate(profileUserId);
    } else {
      followUser.mutate(profileUserId);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTime = (dateStr: string) => {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
  };

  const getInitial = () => {
    if (profile?.display_name) return profile.display_name[0].toUpperCase();
    if (profile?.username) return profile.username[0].toUpperCase();
    return 'U';
  };

  // Mock badges and achievements (would come from separate tables in real app)
  const badges = [
    { name: 'Early Adopter', type: 'bronze', icon: '🚀' },
    { name: 'First Post', type: 'bronze', icon: '📝' },
  ];

  const achievements = [
    { name: 'Streak 7 ngày', progress: 50, icon: '🔥' },
    { name: 'Nhận 100 likes', progress: 25, icon: '❤️' },
  ];

  if (profileLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (profileError || !profile) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy người dùng</h2>
          <p className="text-muted-foreground mb-6">Người dùng này không tồn tại hoặc đã bị xóa.</p>
          <Button variant="gradient" asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </Layout>
    );
  }

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
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name || profile.username || 'User'}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-background shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl sm:text-5xl font-bold text-primary-foreground border-4 border-background shadow-xl">
                    {getInitial()}
                  </div>
                )}
                {profile.reputation && profile.reputation > 5000 && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-lg border-2 border-background">
                    👑
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 mt-4 sm:mt-0 sm:mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-2xl font-bold">
                    {profile.display_name || profile.username || 'Người dùng'}
                  </h1>
                  {profile.reputation && profile.reputation > 10000 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="gold" className="gap-1">
                        <Trophy className="w-3 h-3" />
                        {(profile.reputation / 1000).toFixed(0)}K RP
                      </Badge>
                    </div>
                  )}
                </div>
                {profile.username && (
                  <p className="text-muted-foreground">@{profile.username}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 sm:mt-0 sm:mb-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="gradient" className="gap-2" asChild>
                      <Link to="/settings/profile">
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/settings">
                        <Settings className="w-5 h-5" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant={isFollowing ? "outline" : "gradient"}
                      onClick={handleFollowToggle}
                      disabled={followUser.isPending || unfollowUser.isPending}
                    >
                      {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                    </Button>
                    <Button variant="outline">Nhắn tin</Button>
                  </>
                )}
              </div>
            </div>

            {/* Bio & Details */}
            <div className="mt-6 grid lg:grid-cols-[1fr_300px] gap-6">
              <div>
                {profile.bio && (
                  <p className="text-foreground mb-4">{profile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <LinkIcon className="w-4 h-4" />
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tham gia {formatTime(profile.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {profile.github_username && (
                    <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.twitter_username && (
                    <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin_username && (
                    <a href={`https://linkedin.com/in/${profile.linkedin_username}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="tech">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{(profile.reputation || 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Điểm uy tín</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{(profile.followers_count || 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.following_count || 0}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {userPosts?.length || 0} bài viết
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingBag className="w-4 h-4" />
                    {userProducts?.length || 0} sản phẩm
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
                { id: 'series', label: 'Series', icon: LayersIcon },
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
                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : userPosts && userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="line-clamp-3">{post.content}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.map((tag) => (
                            <Badge key={tag} variant="tech" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {(post.views_count || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes_count || 0}
                          </span>
                          <span>{formatTime(post.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Chưa có bài viết nào
                  </div>
                )}
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {productsLoading ? (
                  <div className="col-span-2 flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : userProducts && userProducts.length > 0 ? (
                  userProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/marketplace/${product.id}`}
                      className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        {product.preview_images && product.preview_images[0] ? (
                          <img
                            src={product.preview_images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className={product.price === 0 ? 'text-reputation font-medium' : 'text-primary font-bold'}>
                            {formatPrice(product.price)}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {product.rating || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    Chưa có sản phẩm nào
                  </div>
                )}
              </div>
            )}

            {/* Badges */}
            {activeTab === 'badges' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge, index) => (
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

            {/* Series placeholder */}
            {activeTab === 'series' && (
              <div className="text-center py-12 text-muted-foreground">
                Chưa có series nào
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
                {achievements.map((achievement, index) => (
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

            {/* Activity placeholder */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                {userPosts && userPosts.length > 0 ? (
                  userPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <span>Đăng bài viết mới</span>
                      <span className="text-xs">{formatTime(post.created_at)}</span>
                    </div>
                  ))
                ) : (
                  <p>Chưa có hoạt động</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
