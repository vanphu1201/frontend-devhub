import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import {
    useAdminBlogPosts,
    useApproveBlogPost,
    useDeleteBlogPost,
    useSeries,
    useDeleteSeries,
    useCreateSeries,
    BlogPost,
    Series
} from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Edit,
    Plus,
    Check,
    X,
    ShieldCheck,
    FileText,
    Layers,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

const Admin: React.FC = () => {
    const { isAdmin, loading } = useAuth();
    const { data: posts, isLoading: postsLoading } = useAdminBlogPosts();
    const { data: series, isLoading: seriesLoading } = useSeries();

    const approvePost = useApproveBlogPost();
    const deletePost = useDeleteBlogPost();
    const deleteSeries = useDeleteSeries();

    if (loading) return <div>Loading...</div>;
    if (!isAdmin) return <Navigate to="/" replace />;

    const handleApprove = (id: string) => {
        approvePost.mutate({ id, status: 'approved' });
    };

    const handleReject = (id: string) => {
        approvePost.mutate({ id, status: 'rejected' });
    };

    const handleDeletePost = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            deletePost.mutate(id);
        }
    };

    const handleDeleteSeries = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa series này?')) {
            deleteSeries.mutate(id);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Đã duyệt</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Từ chối</Badge>;
            case 'pending':
            default:
                return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Đang chờ</Badge>;
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">Quản lý nội dung và người dùng hệ thống</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Users className="w-4 h-4" />
                            Quản lý User
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="posts" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="posts" className="rounded-lg gap-2">
                            <FileText className="w-4 h-4" />
                            Bài viết
                        </TabsTrigger>
                        <TabsTrigger value="series" className="rounded-lg gap-2">
                            <Layers className="w-4 h-4" />
                            Series
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts">
                        <div className="bg-card rounded-2xl border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/30 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold">Bài viết</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Tác giả</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Ngày tạo</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Trạng thái</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {postsLoading ? (
                                            <tr><td colSpan={5} className="px-6 py-8 text-center">Đang tải...</td></tr>
                                        ) : posts?.map((post) => (
                                            <tr key={post.id} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm line-clamp-1">{post.title}</span>
                                                        <span className="text-xs text-muted-foreground">{post.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                                                            {post.author?.display_name?.[0].toUpperCase() || 'U'}
                                                        </div>
                                                        <span className="text-sm">{post.author?.display_name || 'Anonymous'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge((post as any).status || 'pending')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {(post as any).status !== 'approved' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                                                                onClick={() => handleApprove(post.id)}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {(post as any).status !== 'rejected' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleReject(post.id)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeletePost(post.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="series">
                        <div className="flex justify-end mb-4">
                            <Button variant="gradient" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Tạo Series mới
                            </Button>
                        </div>
                        <div className="bg-card rounded-2xl border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/30 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold">Series</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Tác giả</th>
                                            <th className="px-6 py-4 text-sm font-semibold">Số bài viết</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {seriesLoading ? (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center">Đang tải...</td></tr>
                                        ) : series?.length === 0 ? (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Chưa có series nào</td></tr>
                                        ) : series?.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{item.title}</span>
                                                        <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {item.author?.display_name || 'Anonymous'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    -
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteSeries(item.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default Admin;
