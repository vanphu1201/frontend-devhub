import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Search,
  ArrowLeft,
  Filter,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { UserRowSkeleton } from '@/components/shared/Skeletons';
import { useLeaderboard } from '@/hooks/useProfile';

const Leaderboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'monthly' | 'weekly'>('all');

  const { data: contributors, isLoading } = useLeaderboard(50);

  const filteredContributors = (contributors || []).filter(c =>
    (c.display_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-amber-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-amber-500 to-orange-600';
      default: return 'from-primary to-accent';
    }
  };

  const getLevel = (reputation: number) => {
    if (reputation >= 10000) return 'Chuyên gia';
    if (reputation >= 5000) return 'Bậc thầy';
    if (reputation >= 1000) return 'Kỹ sư';
    return 'Thành viên mới';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại trang chủ
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 text-yellow-500 mb-3">
                  <Trophy className="w-8 h-8 animate-bounce" />
                  <span className="text-lg font-semibold uppercase tracking-wider">Bảng xếp hạng hệ thống</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Cộng tác viên <span className="text-primary italic">Hàng đầu</span>
                </h1>
                <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
                  Vinh danh những thành viên có đóng góp tích cực nhất trong cộng đồng CodeConnect Hub.
                  Mỗi đóng góp của bạn đều giúp cộng đồng ngày càng lớn mạnh.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Tìm kiếm developer..."
                    className="pl-10 w-full sm:w-64 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2 backdrop-blur-sm bg-card/50 border-border/50">
                  <Filter className="w-4 h-4" />
                  Lọc
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-2xl w-fit mb-10 border border-border/50">
            {[
              { id: 'all', label: 'Tất cả thời gian', icon: Star },
              { id: 'monthly', label: 'Theo tháng', icon: Zap },
              { id: 'weekly', label: 'Theo tuần', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Leaderboard Table/Cards */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <UserRowSkeleton key={i} />
                ))}
              </div>
            ) : filteredContributors.length > 0 ? (
              filteredContributors.map((user, index) => (
                <div
                  key={user.id}
                  className="group relative bg-card rounded-2xl border border-border/40 p-5 sm:p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Rank Gradient Background for Top 3 */}
                  {index < 3 && (
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getRankColor(index + 1)} opacity-[0.03] rounded-bl-full -mr-10 -mt-10 group-hover:opacity-[0.06] transition-opacity`} />
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Rank & Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>

                      <div className="relative">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg bg-gradient-to-br overflow-hidden ${getRankColor(index + 1)} group-hover:scale-105 transition-transform duration-300`}>
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.display_name || user.username || ''} className="w-full h-full object-cover" />
                          ) : (
                            (user.display_name || user.username || 'U')[0].toUpperCase()
                          )}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1.5 rounded-full shadow-lg border-2 border-background">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <Link
                          to={`/profile/${user.username}`}
                          className="text-xl font-bold hover:text-primary transition-colors truncate"
                        >
                          {user.display_name || user.username}
                        </Link>
                        <Badge variant="outline" className="w-fit mx-auto sm:mx-0 border-primary/20 text-primary bg-primary/5">
                          {getLevel(user.reputation || 0)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start gap-4 mb-4 text-sm text-muted-foreground">
                        <span className="font-medium">@{user.username}</span>
                        <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-reputation" />
                          <span className="font-bold text-reputation">{(user.reputation || 0).toLocaleString()}</span>
                          <span className="text-xs">điểm</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {(user.skills || []).slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="tech" className="text-xs bg-muted/50 border-none px-3">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats Desktop */}
                    <div className="hidden lg:grid grid-cols-2 gap-8 px-8 border-x border-border/50">
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.followers_count || 0}</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.following_count || 0}</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Following</div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm" asChild className="rounded-xl px-6 group/btn border-primary/30 text-primary hover:bg-primary/10">
                        <Link to={`/profile/${user.username}`}>
                          Xem hồ sơ
                          <Star className="w-3.5 h-3.5 ml-2 group-hover/btn:rotate-45 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Không tìm thấy kết quả</h3>
                <p className="text-muted-foreground mt-2">Hãy thử tìm kiếm với tên hoặc username khác.</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSearchTerm('')}
                >
                  Xóa tìm kiếm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
