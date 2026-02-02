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
  Filter,
  Loader2,
  ExternalLink as ExternalLinkIcon
} from 'lucide-react';
import { useUserPurchases } from '@/hooks/useProducts';
import { useUserTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'purchases' | 'tickets'>('purchases');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: purchases = [], isLoading: loadingPurchases } = useUserPurchases();
  const { data: tickets = [], isLoading: loadingTickets } = useUserTickets();

  const stats = [
    {
      label: 'Sản phẩm đã mua',
      value: purchases.length,
      icon: ShoppingBag,
      color: 'text-primary'
    },
    {
      label: 'Tổng tải xuống',
      value: purchases.reduce((acc, p) => acc + (p.download_count || 0), 0),
      icon: Download,
      color: 'text-accent'
    },
    {
      label: 'Tickets hỗ trợ',
      value: tickets.length,
      icon: MessageSquare,
      color: 'text-yellow-500'
    },
  ];

  const filteredPurchases = purchases.filter((p) =>
    p.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter((t) =>
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'purchases'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Sản phẩm đã mua
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'tickets'
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
            <Button variant="gradient" className="gap-2" asChild>
              <Link to="/marketplace">
                <Plus className="w-4 h-4" />
                Tạo Ticket mới (Từ SP)
              </Link>
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
            {loadingPurchases ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">Bạn chưa mua sản phẩm nào.</p>
                <Button variant="link" asChild>
                  <Link to="/marketplace">Đến Marketplace ngay</Link>
                </Button>
              </div>
            ) : (
              filteredPurchases.map((purchase, index) => (
                <div
                  key={purchase.id}
                  className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-48 aspect-video sm:aspect-square bg-muted flex-shrink-0">
                      <img
                        src={purchase.product?.preview_images?.[0] || '/placeholder.svg'}
                        alt={purchase.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{purchase.product?.name}</h3>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Mua ngày {new Date(purchase.purchased_at).toLocaleDateString('vi-VN')}
                            </span>
                            <span>Phiên bản: {purchase.product?.version || '1.0.0'}</span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {purchase.download_count} lượt tải
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button variant="gradient" size="sm" className="gap-1">
                              <Download className="w-4 h-4" />
                              Tải xuống
                            </Button>
                            {purchase.product?.documentation_url && (
                              <Button variant="outline" size="sm" className="gap-1" asChild>
                                <a href={purchase.product.documentation_url} target="_blank" rel="noopener noreferrer">
                                  <FileText className="w-4 h-4" />
                                  Tài liệu
                                </a>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-1" asChild>
                              <Link to={`/marketplace/${purchase.product_id}`}>
                                <Eye className="w-4 h-4" />
                                Xem & Đánh giá
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-lg font-bold ${purchase.price_paid === 0 ? 'text-green-500' : 'text-primary'}`}>
                            {formatPrice(purchase.price_paid)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {loadingTickets ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p>Đang tải tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Chưa có ticket nào</h3>
                <p className="text-muted-foreground mb-4">
                  Tạo ticket nếu bạn cần hỗ trợ kỹ thuật cho sản phẩm
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket, index) => (
                <Link
                  key={ticket.id}
                  to={`/dashboard/tickets/${ticket.id}`}
                  className="block animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ticket.status === 'open' ? 'bg-yellow-500/10' : 'bg-green-500/10'
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
                            Sản phẩm: {ticket.product?.name || 'Không xác định'}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Tạo ngày {new Date(ticket.created_at).toLocaleDateString('vi-VN')}</span>
                            <span>•</span>
                            <span>ID: {ticket.id.split('-')[0]}</span>
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
                          {ticket.status === 'open' ? 'Đang mở' :
                            ticket.status === 'resolved' ? 'Đã giải quyết' : 'Đã đóng'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
