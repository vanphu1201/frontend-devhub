import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Download, 
  FileText, 
  MessageSquare, 
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'tickets'>('purchases');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Sản phẩm đã mua', value: 5, icon: ShoppingBag, color: 'text-primary' },
    { label: 'Tổng tải xuống', value: 23, icon: Download, color: 'text-accent' },
    { label: 'Tickets hỗ trợ', value: 2, icon: MessageSquare, color: 'text-yellow-500' },
  ];

  const purchases = [
    {
      id: 1,
      name: 'SaaS Dashboard Pro',
      price: 890000,
      purchaseDate: '15/01/2024',
      version: '2.1.0',
      image: '/placeholder.svg',
      status: 'active',
      downloadCount: 5,
      documentation: true,
      hasUpdate: true,
      updateVersion: '2.2.0',
    },
    {
      id: 2,
      name: 'E-commerce Starter Kit',
      price: 590000,
      purchaseDate: '10/01/2024',
      version: '1.5.0',
      image: '/placeholder.svg',
      status: 'active',
      downloadCount: 3,
      documentation: true,
      hasUpdate: false,
    },
    {
      id: 3,
      name: 'Blog Platform Template',
      price: 0,
      purchaseDate: '05/01/2024',
      version: '1.0.0',
      image: '/placeholder.svg',
      status: 'active',
      downloadCount: 8,
      documentation: true,
      hasUpdate: false,
    },
    {
      id: 4,
      name: 'Admin Template Ultimate',
      price: 690000,
      purchaseDate: '01/01/2024',
      version: '3.0.0',
      image: '/placeholder.svg',
      status: 'active',
      downloadCount: 7,
      documentation: true,
      hasUpdate: true,
      updateVersion: '3.1.0',
    },
  ];

  const tickets = [
    {
      id: 1,
      subject: 'Lỗi khi cài đặt dependencies',
      product: 'SaaS Dashboard Pro',
      status: 'open',
      priority: 'high',
      createdAt: '16/01/2024',
      lastReply: '17/01/2024',
      replies: 3,
    },
    {
      id: 2,
      subject: 'Hỏi về cách customize theme',
      product: 'E-commerce Starter Kit',
      status: 'resolved',
      priority: 'medium',
      createdAt: '12/01/2024',
      lastReply: '14/01/2024',
      replies: 5,
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Quản lý sản phẩm đã mua và yêu cầu hỗ trợ
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'purchases'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Sản phẩm đã mua
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tickets'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Tickets hỗ trợ
              {tickets.filter(t => t.status === 'open').length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {tickets.filter(t => t.status === 'open').length}
                </Badge>
              )}
            </button>
          </div>

          {activeTab === 'tickets' && (
            <Button variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo Ticket mới
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={activeTab === 'purchases' ? 'Tìm kiếm sản phẩm...' : 'Tìm kiếm ticket...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            {purchases.map((product, index) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 aspect-video sm:aspect-square bg-muted flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          {product.hasUpdate && (
                            <Badge variant="info" className="text-xs">
                              v{product.updateVersion} có sẵn
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Mua ngày {product.purchaseDate}
                          </span>
                          <span>Phiên bản: v{product.version}</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {product.downloadCount} lượt tải
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="gradient" size="sm" className="gap-1">
                            <Download className="w-4 h-4" />
                            Tải xuống
                          </Button>
                          {product.documentation && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileText className="w-4 h-4" />
                              Documentation
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="gap-1" asChild>
                            <Link to={`/marketplace/${product.id}`}>
                              <Eye className="w-4 h-4" />
                              Xem sản phẩm
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-lg font-bold ${product.price === 0 ? 'text-green-500' : 'text-primary'}`}>
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Chưa có ticket nào</h3>
                <p className="text-muted-foreground mb-4">
                  Tạo ticket nếu bạn cần hỗ trợ kỹ thuật
                </p>
                <Button variant="gradient">Tạo Ticket mới</Button>
              </div>
            ) : (
              tickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ticket.status === 'open' ? 'bg-yellow-500/10' : 'bg-green-500/10'
                      }`}>
                        {ticket.status === 'open' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Sản phẩm: {ticket.product}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Tạo ngày {ticket.createdAt}</span>
                          <span>•</span>
                          <span>{ticket.replies} phản hồi</span>
                          <span>•</span>
                          <span>Cập nhật: {ticket.lastReply}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          ticket.priority === 'high' ? 'destructive' :
                          ticket.priority === 'medium' ? 'warning' : 'secondary'
                        }
                      >
                        {ticket.priority === 'high' ? 'Cao' :
                         ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Badge>
                      <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                        {ticket.status === 'open' ? 'Đang mở' : 'Đã giải quyết'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
