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
import { useTicket, useTicketMessages, useAddTicketMessage, useUpdateTicketStatus } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TicketDetail: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [reply, setReply] = useState('');

    const { data: ticket, isLoading: loadingTicket } = useTicket(id || '');
    const { data: messages = [], isLoading: loadingMessages } = useTicketMessages(id || '');
    const addMessage = useAddTicketMessage();
    const updateStatus = useUpdateTicketStatus();
    const { isAdmin, loading: authLoading } = useAuth();

    const handleSendReply = () => {
        if (!reply.trim()) return;
        addMessage.mutate({ ticketId: id!, message: reply }, {
            onSuccess: () => setReply('')
        });
    };

    const handleUpdateStatus = (newStatus: any) => {
        updateStatus.mutate({ ticketId: id!, status: newStatus });
    };

    if (loadingTicket || loadingMessages || authLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!isAdmin) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6 text-destructive">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Trang này chỉ dành cho Quản trị viên</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Bạn không có quyền truy cập vào khu vực này. Vui lòng quay lại Dashboard để xem các yêu cầu hỗ trợ của bạn.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/dashboard">Quay lại Dashboard</Link>
                    </Button>
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
                        <Link to="/admin">Quay lại Admin Console</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => {
                            if (isAdmin) {
                                // If admin, we don't have a direct section link in URL, 
                                // so we just go back and maybe the user has to click Support again.
                                // Or we could add a state if Admin.tsx supported it via URL params.
                            }
                        }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Quay lại {isAdmin ? "Admin Console" : "Dashboard"}
                    </Link>

                    {isAdmin && (
                        <div className="flex gap-2">
                            {ticket.status !== 'resolved' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 rounded-lg text-[11px] font-bold border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                    onClick={() => handleUpdateStatus('resolved')}
                                >
                                    Đánh dấu đã xong
                                </Button>
                            )}
                            {ticket.status !== 'closed' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 rounded-lg text-[11px] font-bold border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
                                    onClick={() => handleUpdateStatus('closed')}
                                >
                                    Đóng Ticket
                                </Button>
                            )}
                        </div>
                    )}
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
                            messages.map((msg) => {
                                const isStaff = msg.is_staff_reply;
                                const isMe = msg.user_id === user?.id;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${isStaff ? 'flex-row-reverse' : 'flex-row'} items-start animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold shadow-sm ${isStaff
                                            ? 'bg-primary text-primary-foreground border-2 border-primary/20 ring-2 ring-primary/10 order-2'
                                            : 'bg-muted border border-border order-0'
                                            }`}>
                                            {msg.author?.display_name?.[0].toUpperCase() || (isStaff ? 'S' : 'U')}
                                        </div>
                                        <div className={`flex flex-col gap-1 max-w-[75%] ${isStaff ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2 px-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isStaff ? 'text-primary' : 'text-muted-foreground'}`}>
                                                    {isMe ? 'Bạn' : msg.author?.display_name || (isStaff ? 'Hỗ trợ viên' : 'Khách hàng')}
                                                </span>
                                                {isStaff && <Badge variant="secondary" className="text-[8px] h-3.5 px-1 bg-primary text-primary-foreground border-none">Staff</Badge>}
                                                <span className="text-[9px] text-muted-foreground/60 tabular-nums">
                                                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isStaff
                                                ? 'bg-primary text-primary-foreground rounded-tr-none border-0'
                                                : 'bg-card border border-border rounded-tl-none font-medium text-foreground'
                                                }`}>
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
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
