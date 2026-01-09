import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TribesSection: React.FC = () => {
  const tribes = [
    {
      id: 1,
      name: 'React Vietnam',
      description: 'Cộng đồng React lớn nhất Việt Nam',
      members: 12500,
      posts: 3420,
      color: 'from-cyan-500 to-blue-500',
      icon: '⚛️',
    },
    {
      id: 2,
      name: 'Python Developers',
      description: 'Chia sẻ kiến thức Python, Django, Flask',
      members: 8900,
      posts: 2180,
      color: 'from-yellow-500 to-green-500',
      icon: '🐍',
    },
    {
      id: 3,
      name: 'Backend Engineers',
      description: 'Node.js, Go, Rust và backend technologies',
      members: 7600,
      posts: 1890,
      color: 'from-green-500 to-emerald-500',
      icon: '⚙️',
    },
    {
      id: 4,
      name: 'DevOps & Cloud',
      description: 'AWS, Docker, Kubernetes và CI/CD',
      members: 5400,
      posts: 1240,
      color: 'from-orange-500 to-red-500',
      icon: '☁️',
    },
    {
      id: 5,
      name: 'AI & Machine Learning',
      description: 'Deep Learning, NLP, Computer Vision',
      members: 4200,
      posts: 980,
      color: 'from-purple-500 to-pink-500',
      icon: '🤖',
    },
    {
      id: 6,
      name: 'Mobile Developers',
      description: 'React Native, Flutter, Swift, Kotlin',
      members: 3800,
      posts: 890,
      color: 'from-indigo-500 to-purple-500',
      icon: '📱',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Tribes</span>
            </div>
            <h2 className="text-3xl font-bold">Tham gia các nhóm</h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/tribes" className="flex items-center gap-2">
              Khám phá tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tribes.map((tribe, index) => (
            <Link
              key={tribe.id}
              to={`/tribes/${tribe.id}`}
              className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/50 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tribe.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {tribe.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {tribe.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {tribe.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {tribe.members.toLocaleString()} thành viên
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  {tribe.posts.toLocaleString()} bài viết
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/tribes" className="flex items-center gap-2">
              Khám phá tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TribesSection;
