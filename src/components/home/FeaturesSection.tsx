import React from 'react';
import { 
  Code2, 
  Users, 
  Trophy, 
  BookOpen, 
  Download, 
  ShoppingCart, 
  MessageSquare, 
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Code2,
      title: 'Smart-Post Editor',
      description: 'Soạn thảo với Markdown, highlight code tự động cho 50+ ngôn ngữ lập trình.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Hệ thống huy hiệu và điểm uy tín giúp bạn xây dựng danh tiếng trong cộng đồng.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Tribes & Guilds',
      description: 'Tạo và tham gia các nhóm theo công nghệ như React, Node.js, Python...',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Series & Roadmap',
      description: 'Tổ chức bài viết thành chuỗi học tập có hệ thống, dễ theo dõi.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Download,
      title: 'Download Center',
      description: 'Chia sẻ tài liệu miễn phí và premium với preview PDF/Code trực tiếp.',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: ShoppingCart,
      title: 'Product Marketplace',
      description: 'Mua bán template, source code với live preview responsive.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: MessageSquare,
      title: 'Ticket Support',
      description: 'Hệ thống hỗ trợ kỹ thuật cho người mua sản phẩm.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Quiz & Assessment',
      description: 'Tạo bài kiểm tra trắc nghiệm để đánh giá kiến thức.',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: Shield,
      title: 'Thanh toán an toàn',
      description: 'Tích hợp Momo, VNPay, PayPal cho giao dịch tự động.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Globe,
      title: 'PWA Support',
      description: 'Cài đặt ứng dụng trên điện thoại mà không cần App Store.',
      color: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tất cả những gì bạn cần,
            <span className="gradient-text"> trong một nền tảng</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            DevHub cung cấp đầy đủ công cụ để bạn học tập, chia sẻ và kiếm tiền từ kiến thức lập trình.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
