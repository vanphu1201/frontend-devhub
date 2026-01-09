import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark,
  ChevronLeft,
  User,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  List
} from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams();

  // Mock data
  const post = {
    id: 1,
    title: 'Hướng dẫn xây dựng REST API với Node.js và Express từ A-Z',
    content: `
# Giới thiệu

Trong bài viết này, chúng ta sẽ cùng nhau xây dựng một REST API hoàn chỉnh với Node.js và Express. Đây là kiến thức cơ bản nhưng vô cùng quan trọng cho bất kỳ backend developer nào.

## Yêu cầu

- Node.js phiên bản 18 trở lên
- NPM hoặc Yarn
- Kiến thức JavaScript cơ bản

## Bước 1: Khởi tạo dự án

\`\`\`bash
mkdir my-api
cd my-api
npm init -y
npm install express mongoose dotenv cors
\`\`\`

## Bước 2: Tạo server cơ bản

\`\`\`javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Bước 3: Kết nối MongoDB

\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
\`\`\`

## Kết luận

Vậy là chúng ta đã hoàn thành việc xây dựng một REST API cơ bản. Trong các bài viết tiếp theo, mình sẽ hướng dẫn thêm về authentication, validation, và error handling.

> **Tip**: Luôn nhớ validate input từ client và xử lý lỗi một cách graceful nhé!

Nếu bạn có câu hỏi nào, hãy để lại comment bên dưới nhé! 👇
    `,
    author: {
      name: 'Nguyễn Văn A',
      username: '@nguyenvana',
      avatar: 'N',
      reputation: 2500,
      bio: 'Full-stack developer | 5 năm kinh nghiệm | Yêu thích Node.js và React',
      followers: 1234,
      posts: 45,
    },
    series: {
      name: 'Node.js Masterclass',
      currentPart: 3,
      totalParts: 10,
    },
    category: 'Backend',
    tags: ['Node.js', 'Express', 'API', 'MongoDB', 'JavaScript'],
    createdAt: '15/01/2024',
    updatedAt: '16/01/2024',
    readTime: '12 phút',
    views: 15420,
    likes: 892,
    comments: 156,
  };

  const tableOfContents = [
    { id: 'intro', title: 'Giới thiệu', level: 1 },
    { id: 'requirements', title: 'Yêu cầu', level: 2 },
    { id: 'step-1', title: 'Bước 1: Khởi tạo dự án', level: 2 },
    { id: 'step-2', title: 'Bước 2: Tạo server cơ bản', level: 2 },
    { id: 'step-3', title: 'Bước 3: Kết nối MongoDB', level: 2 },
    { id: 'conclusion', title: 'Kết luận', level: 2 },
  ];

  const comments = [
    {
      id: 1,
      author: { name: 'Trần Văn B', avatar: 'T', reputation: 1500 },
      content: 'Bài viết rất chi tiết và dễ hiểu. Cảm ơn tác giả! 👏',
      createdAt: '1 giờ trước',
      likes: 23,
      replies: 2,
    },
    {
      id: 2,
      author: { name: 'Lê Thị C', avatar: 'L', reputation: 800 },
      content: 'Cho mình hỏi là phần authentication sẽ được hướng dẫn ở bài nào vậy ạ?',
      createdAt: '3 giờ trước',
      likes: 5,
      replies: 1,
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/blog" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Blog
          </Link>
          <span>/</span>
          <span>{post.category}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div>
            {/* Series Banner */}
            {post.series && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="gradient" className="mb-2">Series</Badge>
                    <h4 className="font-medium">{post.series.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Phần {post.series.currentPart} / {post.series.totalParts}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Xem toàn bộ
                  </Button>
                </div>
              </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="tech">{tag}</Badge>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views.toLocaleString()} lượt xem
                </span>
              </div>
            </header>

            {/* Author Card */}
            <div className="bg-card rounded-xl border border-border p-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {post.author.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${post.author.username}`} className="font-semibold hover:text-primary">
                      {post.author.name}
                    </Link>
                    <Badge variant="gold">Pro</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>⭐ {post.author.reputation.toLocaleString()} RP</span>
                    <span>{post.author.followers.toLocaleString()} followers</span>
                    <span>{post.author.posts} bài viết</span>
                  </div>
                </div>
                <Button variant="gradient">Theo dõi</Button>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <div className="markdown-content whitespace-pre-wrap">
                {post.content}
              </div>
            </article>

            {/* Article Actions */}
            <div className="flex items-center justify-between py-6 border-y border-border mb-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <section>
              <h2 className="text-xl font-semibold mb-6">
                Bình luận ({post.comments})
              </h2>

              {/* Comment Form */}
              <div className="bg-card rounded-xl border border-border p-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                    D
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Viết bình luận của bạn..."
                      className="w-full min-h-[100px] bg-muted/50 rounded-lg p-3 border border-border focus:border-primary outline-none resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button variant="gradient">Gửi bình luận</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                        {comment.author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ⭐ {comment.author.reputation} RP
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-primary transition-colors">
                            Trả lời ({comment.replies})
                          </button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Table of Contents */}
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Mục lục</h3>
              </div>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm hover:text-primary transition-colors ${
                      item.level === 1 ? 'font-medium' : 'pl-4 text-muted-foreground'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
