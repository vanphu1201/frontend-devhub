import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Image, 
  Code, 
  Hash, 
  AtSign,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Flame,
  Eye
} from 'lucide-react';

const Feed: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'following'>('trending');

  const posts = [
    {
      id: 1,
      author: {
        name: 'Nguyễn Minh Đức',
        username: '@minhduc',
        avatar: 'M',
        reputation: 12500,
        badges: ['JavaScript Expert'],
      },
      content: `# Cách tối ưu React Performance 🚀

Hôm nay mình chia sẻ một số tips quan trọng:

\`\`\`javascript
// Sử dụng useMemo cho expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// Sử dụng useCallback cho callbacks
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

Các bạn có thêm tips nào không? Comment bên dưới nhé! 👇`,
      tags: ['React', 'Performance', 'JavaScript'],
      createdAt: '2 giờ trước',
      likes: 234,
      comments: 45,
      shares: 12,
      views: 1520,
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: 2,
      author: {
        name: 'Trần Thị Hương',
        username: '@huongtran',
        avatar: 'H',
        reputation: 10800,
        badges: ['Python Master'],
      },
      content: `Vừa hoàn thành dự án ML đầu tiên với accuracy 95%! 🎉

Model: Random Forest + XGBoost Ensemble
Dataset: 50k samples
Training time: 2 hours on GPU

Link GitHub trong bio, mọi người feedback giúp mình nhé!`,
      tags: ['Python', 'Machine Learning', 'Data Science'],
      createdAt: '5 giờ trước',
      likes: 567,
      comments: 89,
      shares: 34,
      views: 3240,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 3,
      author: {
        name: 'Lê Văn Thành',
        username: '@thanhlv',
        avatar: 'T',
        reputation: 9200,
        badges: ['DevOps Pro'],
      },
      content: `Docker tip của ngày 🐳

Bạn có biết rằng multi-stage builds có thể giảm image size lên đến 90%?

\`\`\`dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage  
FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "index.js"]
\`\`\`

Image gốc: 1.2GB → Sau optimize: 120MB 💪`,
      tags: ['Docker', 'DevOps', 'Optimization'],
      createdAt: '8 giờ trước',
      likes: 892,
      comments: 156,
      shares: 67,
      views: 5670,
      isLiked: false,
      isBookmarked: false,
    },
  ];

  const trendingTopics = [
    { tag: 'React', posts: 1234 },
    { tag: 'TypeScript', posts: 987 },
    { tag: 'AI', posts: 876 },
    { tag: 'Next.js', posts: 654 },
    { tag: 'DevOps', posts: 543 },
  ];

  const suggestedUsers = [
    { name: 'Phạm Văn A', username: '@phamvana', avatar: 'P', reputation: 5600 },
    { name: 'Ngô Thị B', username: '@ngothib', avatar: 'N', reputation: 4300 },
    { name: 'Đỗ Văn C', username: '@dovanc', avatar: 'D', reputation: 3800 },
  ];

  return (
    <Layout showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* Create Post */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                  D
                </div>
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Chia sẻ kiến thức, đặt câu hỏi hoặc viết code..."
                    className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Image className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Code className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Hash className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <AtSign className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button variant="gradient" className="gap-2">
                      <Send className="w-4 h-4" />
                      Đăng bài
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Tabs */}
            <div className="flex items-center gap-2 bg-card rounded-xl border border-border p-1">
              {[
                { id: 'trending', label: 'Xu hướng', icon: Flame },
                { id: 'latest', label: 'Mới nhất', icon: Clock },
                { id: 'following', label: 'Đang theo dõi', icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg">
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.name}</span>
                            {post.author.badges.map((badge) => (
                              <Badge key={badge} variant="gold" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{post.author.username}</span>
                            <span>•</span>
                            <span>{post.createdAt}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {post.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">{post.content}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="tech">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-2 ${post.isLiked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        {post.shares}
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={post.isBookmarked ? 'text-primary' : ''}
                    >
                      <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Trending Topics */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Xu hướng</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">{index + 1}</span>
                      <Badge variant="tech" className="cursor-pointer hover:bg-primary/20">
                        #{topic.tag}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{topic.posts} bài</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Gợi ý theo dõi</h3>
              <div className="space-y-4">
                {suggestedUsers.map((user) => (
                  <div key={user.username} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ⭐ {user.reputation.toLocaleString()} RP
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Theo dõi
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
              <h3 className="font-semibold mb-4">Thống kê hôm nay</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,234</div>
                  <div className="text-xs text-muted-foreground">Bài viết mới</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">5,678</div>
                  <div className="text-xs text-muted-foreground">Thành viên online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
