import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRowSkeleton } from '@/components/shared/Skeletons';
import { useLeaderboard } from '@/hooks/useProfile';

const TopContributors: React.FC = () => {
  const { data: contributors, isLoading } = useLeaderboard(5);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'gold';
      case 2:
        return 'silver';
      case 3:
        return 'bronze';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => <UserRowSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Leaderboard</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Top Contributors</h2>
          </div>
          <Button
            asChild
            className="hidden sm:flex bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white rounded-xl px-6 h-12 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link to="/leaderboard" className="flex items-center gap-2">
              Xem bảng xếp hạng
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {(contributors || []).map((user, index) => (
            <div
              key={user.id}
              className="group bg-card rounded-2xl border border-border p-4 sm:p-6 hover:border-primary/50 card-hover animate-fade-in flex items-center gap-4"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 flex items-center justify-center">
                {getRankIcon(index + 1)}
              </div>

              {/* Avatar */}
              <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg font-bold overflow-hidden ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                  index === 2 ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' :
                    'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                }`}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.display_name || user.username || ''} className="w-full h-full object-cover" />
                ) : (
                  (user.display_name || user.username || 'U')[0].toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/profile/${user.username}`} className="font-semibold hover:text-primary transition-colors">
                    {user.display_name || user.username}
                  </Link>
                  <span className="text-sm text-muted-foreground">@{user.username}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {(user.skills || []).slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="tech" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{user.followers_count || 0}</div>
                  <div className="text-muted-foreground text-xs">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{user.following_count || 0}</div>
                  <div className="text-muted-foreground text-xs">Following</div>
                </div>
              </div>

              {/* Reputation */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-reputation">
                  <TrendingUp className="w-4 h-4" />
                  {user.reputation.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">điểm uy tín</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/leaderboard" className="flex items-center gap-2">
              Xem bảng xếp hạng
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopContributors;
