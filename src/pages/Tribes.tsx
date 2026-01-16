import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Users, 
  FileText,
  Lock,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useTribes, useUserTribes, useJoinTribe, useIsTribeMember, Tribe } from '@/hooks/useTribes';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TribeCard: React.FC<{ tribe: Tribe; featured?: boolean }> = ({ tribe, featured }) => {
  const { user } = useAuth();
  const { data: membership } = useIsTribeMember(tribe.id);
  const joinTribe = useJoinTribe();

  const handleJoin = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để tham gia tribe');
      return;
    }
    joinTribe.mutate(tribe.id);
  };

  if (featured) {
    return (
      <div className="group bg-card rounded-2xl border border-border overflow-hidden card-hover">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-xl bg-card border-4 border-card flex items-center justify-center text-3xl shadow-lg">
              {tribe.avatar || '🏛️'}
            </div>
          </div>
          {tribe.is_private && (
            <Badge className="absolute top-3 right-3 gap-1">
              <Lock className="w-3 h-3" />
              Private
            </Badge>
          )}
        </div>
        <div className="p-6 pt-12">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
            {tribe.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {tribe.description || 'Chưa có mô tả'}
          </p>
          {tribe.tags && tribe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tribe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="tech" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {(tribe.members_count || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {(tribe.posts_count || 0).toLocaleString()} bài
              </span>
            </div>
            {membership?.isMember ? (
              <Badge variant="secondary">Đã tham gia</Badge>
            ) : (
              <Button variant="gradient" size="sm" onClick={handleJoin} disabled={joinTribe.isPending}>
                Tham gia
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-xl border border-border p-5 card-hover">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
          {tribe.avatar || '🏛️'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {tribe.name}
            </h3>
            {tribe.is_private && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {tribe.description || 'Chưa có mô tả'}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {(tribe.members_count || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {(tribe.posts_count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {membership?.isMember ? (
        <Badge variant="secondary" className="w-full mt-4 justify-center">Đã tham gia</Badge>
      ) : (
        <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleJoin} disabled={joinTribe.isPending}>
          Tham gia
        </Button>
      )}
    </div>
  );
};

const Tribes: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'my-tribes'>('discover');

  const { data: allTribes, isLoading } = useTribes();
  const { data: myTribes, isLoading: myTribesLoading } = useUserTribes();

  const featuredTribes = allTribes?.slice(0, 2) || [];
  const otherTribes = allTribes?.slice(2) || [];

  const filteredTribes = searchQuery 
    ? otherTribes.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : otherTribes;

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
              activeTab === 'discover' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Khám phá
          </button>
          <button
            onClick={() => setActiveTab('my-tribes')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'my-tribes' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
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

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Featured Tribes */}
                {featuredTribes.length > 0 && (
                  <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Tribes nổi bật</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {featuredTribes.map((tribe) => (
                        <TribeCard key={tribe.id} tribe={tribe} featured />
                      ))}
                    </div>
                  </section>
                )}

                {/* All Tribes */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Tất cả Tribes</h2>
                  </div>
                  {filteredTribes.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTribes.map((tribe) => (
                        <TribeCard key={tribe.id} tribe={tribe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchQuery ? 'Không tìm thấy tribe phù hợp' : 'Chưa có tribe nào'}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {activeTab === 'my-tribes' && (
          <div className="space-y-4">
            {!user ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Đăng nhập để xem tribes của bạn</h3>
                <Button variant="gradient" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              </div>
            ) : myTribesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : myTribes && myTribes.length > 0 ? (
              myTribes.map((tribe) => (
                <Link
                  key={tribe.id}
                  to={`/tribes/${tribe.id}`}
                  className="flex items-center gap-4 bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl">
                    {tribe.avatar || '🏛️'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{tribe.name}</h3>
                      {tribe.role === 'admin' && <Badge variant="gold" className="text-xs">Admin</Badge>}
                      {tribe.role === 'moderator' && <Badge variant="secondary" className="text-xs">Mod</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(tribe.members_count || 0).toLocaleString()} thành viên
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Chưa tham gia tribe nào</h3>
                <p className="text-muted-foreground mb-4">Khám phá và tham gia các tribes để kết nối</p>
                <Button variant="gradient" onClick={() => setActiveTab('discover')}>
                  Khám phá Tribes
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tribes;
