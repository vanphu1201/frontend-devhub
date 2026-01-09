import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TopContributors: React.FC = () => {
  const contributors = [
    {
      id: 1,
      name: 'Nguyễn Minh Đức',
      username: '@minhduc',
      avatar: 'M',
      reputation: 12500,
      badges: ['JavaScript Expert', 'Top Contributor'],
      skills: ['React', 'Node.js', 'TypeScript'],
      rank: 1,
      posts: 156,
      answers: 423,
    },
    {
      id: 2,
      name: 'Trần Thị Hương',
      username: '@huongtran',
      avatar: 'H',
      reputation: 10800,
      badges: ['Python Master', 'Mentor'],
      skills: ['Python', 'Django', 'AI/ML'],
      rank: 2,
      posts: 98,
      answers: 387,
    },
    {
      id: 3,
      name: 'Lê Văn Thành',
      username: '@thanhlv',
      avatar: 'T',
      reputation: 9200,
      badges: ['DevOps Pro', 'Bug Hunter'],
      skills: ['Docker', 'Kubernetes', 'AWS'],
      rank: 3,
      posts: 67,
      answers: 298,
    },
    {
      id: 4,
      name: 'Phạm Quốc Anh',
      username: '@quocanh',
      avatar: 'A',
      reputation: 8500,
      badges: ['Mobile Expert'],
      skills: ['React Native', 'Flutter', 'iOS'],
      rank: 4,
      posts: 89,
      answers: 234,
    },
    {
      id: 5,
      name: 'Hoàng Thị Mai',
      username: '@maihoang',
      avatar: 'M',
      reputation: 7800,
      badges: ['Frontend Pro'],
      skills: ['Vue.js', 'CSS', 'Animation'],
      rank: 5,
      posts: 78,
      answers: 189,
    },
  ];

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

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Leaderboard</span>
            </div>
            <h2 className="text-3xl font-bold">Top Contributors</h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/leaderboard" className="flex items-center gap-2">
              Xem bảng xếp hạng
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {contributors.map((user, index) => (
            <div
              key={user.id}
              className="group bg-card rounded-2xl border border-border p-4 sm:p-6 hover:border-primary/50 card-hover animate-fade-in flex items-center gap-4"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                user.rank === 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' :
                'bg-gradient-to-br from-primary to-accent text-primary-foreground'
              }`}>
                {user.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/profile/${user.username}`} className="font-semibold hover:text-primary transition-colors">
                    {user.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">{user.username}</span>
                  {user.badges.slice(0, 1).map((badge) => (
                    <Badge key={badge} variant={getRankBadge(user.rank) as any} className="hidden sm:inline-flex text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="tech" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{user.posts}</div>
                  <div className="text-muted-foreground text-xs">Bài viết</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{user.answers}</div>
                  <div className="text-muted-foreground text-xs">Trả lời</div>
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
