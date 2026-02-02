import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    ChevronLeft,
    MessageSquare,
    Clock,
    Send,
    Loader2,
    AlertCircle,
    CheckCircle,
    ShieldAlert
} from 'lucide-react';
import { useTicket, useTicketMessages, useAddTicketMessage } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TicketDetail: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [reply, setReply] = useState('');

    const { data: ticket, isLoading: loadingTicket } = useTicket(id || '');
    const { data: messages = [], isLoading: loadingMessages } = useTicketMessages(id || '');
    const addMessage = useAddTicketMessage();

    const handleSendReply = () => {
        if (!reply.trim()) return;
        addMessage.mutate({ ticketId: id!, message: reply }, {
            onSuccess: () => setReply('')
        });
    };

    if (loadingTicket || loadingMessages) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!ticket) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy ticket</h2>
                    <Button asChild>
                        <Link to="/dashboard">Quay lại Dashboard</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Quay lại Dashboard
                    </Link>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
                    <div className="p-6 border-b border-border bg-muted/20">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{ticket.subject}</h1>
                                <p className="text-muted-foreground">ID: #{ticket.id.split('-')[0]}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 items-start">
                                <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                                    {ticket.status === 'open' ? 'Đang chờ' : ticket.status === 'resolved' ? 'Đã giải quyết' : 'Đã đóng'}
                                </Badge>
                                <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'warning' : 'secondary'}>
                                    {ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Ngày tạo</span>
                                <span className="font-medium">{new Date(ticket.created_at).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Sản phẩm</span>
                                <Link to={`/marketplace/${ticket.product_id}`} className="font-medium text-primary hover:underline">
                                    {ticket.product?.name || 'Sản phẩm'}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {messages.length === 0 ? (
                            <p className="text-center text-muted-foreground italic py-10">Chưa có tin nhắn nào.</p>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-4 ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.user_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {msg.author?.display_name?.[0].toUpperCase() || (msg.user_id === user?.id ? 'U' : 'S')}
                                    </div>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.user_id === user?.id
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : msg.is_staff_reply
                                            ? 'bg-accent/10 border border-accent/20 rounded-tl-none'
                                            : 'bg-muted border border-border rounded-tl-none'
                                        }`}>
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <span className="font-bold text-xs flex items-center gap-1">
                                                {msg.user_id === user?.id ? 'Bạn' : msg.author?.display_name || 'Hỗ trợ viên'}
                                                {msg.is_staff_reply && <Badge variant="secondary" className="text-[9px] h-4 px-1">Staff</Badge>}
                                            </span>
                                            <span className="text-[10px] opacity-70">
                                                {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 border-t border-border bg-muted/10">
                        <div className="flex gap-4">
                            <Textarea
                                placeholder="Nhập nội dung phản hồi..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                className="rounded-xl min-h-[100px] bg-background"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendReply();
                                    }
                                }}
                            />
                            <Button
                                variant="gradient"
                                className="h-auto aspect-square rounded-xl"
                                onClick={handleSendReply}
                                disabled={!reply.trim() || addMessage.isPending}
                            >
                                {addMessage.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">
                            Nhấn Enter để gửi, Shift + Enter để xuống dòng.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TicketDetail;
