import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import {
    useAdminBlogPosts,
    useApproveBlogPost,
    useApproveSeries,
    useDeleteBlogPost,
    useAdminSeries,
    useDeleteSeries,
    useCreateSeries,
    BlogPost,
    Series
} from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
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
    Users,
    Library as LibraryIcon,
    ShoppingCart
} from 'lucide-react';
import ManageResources from '@/components/admin/ManageResources';
import ManageProducts from '@/components/admin/ManageProducts';
import { toast } from 'sonner';

const Admin: React.FC = () => {
    const { isAdmin, loading } = useAuth();
    const [currentSection, setCurrentSection] = useState<'posts' | 'series' | 'library' | 'marketplace' | 'users'>('posts');

    const { data: posts, isLoading: postsLoading } = useAdminBlogPosts({ enabled: !loading && isAdmin });
    const { data: series, isLoading: seriesLoading } = useAdminSeries({ enabled: !loading && isAdmin });

    const approvePost = useApproveBlogPost();
    const approveSeries = useApproveSeries();
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

    const handleApproveSeries = (id: string) => {
        approveSeries.mutate({ id, status: 'approved' });
    };

    const handleRejectSeries = (id: string) => {
        approveSeries.mutate({ id, status: 'rejected' });
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

    const navItems = [
        { id: 'posts', label: 'Bài viết', icon: FileText },
        { id: 'series', label: 'Series', icon: Layers },
        { id: 'library', label: 'Thư viện', icon: LibraryIcon },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
        { id: 'users', label: 'Người dùng', icon: Users },
    ];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen bg-background text-foreground">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar - Minimalist approach */}
                    <aside className="lg:w-64 flex-shrink-0 gentle-reveal" style={{ animationDelay: '0.1s' }}>
                        <div className="sticky top-28 space-y-10">
                            <div>
                                <div className="flex items-center gap-3 px-2 mb-2">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h1 className="text-lg font-bold tracking-tight">Console</h1>
                                </div>
                                <div className="h-px w-full bg-border/40" />
                            </div>

                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setCurrentSection(item.id as any)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${isActive
                                                ? 'bg-primary/5 text-primary'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                            {item.label}
                                            {isActive && (
                                                <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="px-4 py-4 rounded-2xl bg-muted/30 border border-border/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Node Status</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                </div>
                                <div className="text-[11px] font-medium text-muted-foreground">Connected to Core</div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - Clean & Professional */}
                    <main className="flex-1 min-w-0 gentle-reveal" style={{ animationDelay: '0.2s' }}>
                        {currentSection === 'posts' && (
                            <div className="space-y-10">
                                <header className="flex items-end justify-between border-b border-border/40 pb-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
                                        <p className="text-sm text-muted-foreground">Manage and moderate community publications.</p>
                                    </div>
                                    <div className="text-[11px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-wider">
                                        {posts?.length || 0} Total
                                    </div>
                                </header>

                                <div className="soft-glass rounded-3xl border border-border/40 overflow-hidden subtle-shadow">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-[13px]">
                                            <thead>
                                                <tr className="bg-muted/30 text-muted-foreground border-b border-border/40">
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Title</th>
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Author</th>
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Security</th>
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px] text-right">Settings</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/20">
                                                {postsLoading ? (
                                                    <tr><td colSpan={4} className="px-8 py-20 text-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></td></tr>
                                                ) : posts?.length === 0 ? (
                                                    <tr><td colSpan={4} className="px-8 py-20 text-center text-muted-foreground italic">No entries found.</td></tr>
                                                ) : posts?.map((post) => (
                                                    <tr key={post.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</span>
                                                                <span className="text-[11px] text-muted-foreground">{post.category}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                                    {post.author?.display_name?.[0].toUpperCase()}
                                                                </div>
                                                                <span className="font-medium">{post.author?.display_name || 'Anonymous'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="scale-75 origin-left">
                                                                {getStatusBadge((post as any).status || 'pending')}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                {(post as any).status !== 'approved' && (
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 rounded-lg text-emerald-500 hover:bg-emerald-500/10"
                                                                        onClick={() => handleApprove(post.id)}
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" asChild>
                                                                    <Link to={`/blog/edit/${post.id}`}>
                                                                        <Edit className="w-4 h-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
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
                            </div>
                        )}

                        {currentSection === 'series' && (
                            <div className="space-y-10">
                                <header className="flex items-end justify-between border-b border-border/40 pb-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold tracking-tight text-accent">Collections</h2>
                                        <p className="text-sm text-muted-foreground">Curated knowledge series and learning paths.</p>
                                    </div>
                                    <Button variant="outline" className="h-10 px-5 rounded-xl text-[12px] font-bold border-accent/20 text-accent hover:bg-accent hover:text-white transition-all duration-300" asChild>
                                        <Link to="/blog/series/create">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Series
                                        </Link>
                                    </Button>
                                </header>

                                <div className="soft-glass rounded-3xl border border-border/40 overflow-hidden subtle-shadow">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-[13px]">
                                            <thead>
                                                <tr className="bg-muted/30 text-muted-foreground border-b border-border/40">
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Name</th>
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Creator</th>
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Privacy</th>
                                                    <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/20">
                                                {seriesLoading ? (
                                                    <tr><td colSpan={4} className="px-8 py-20 text-center"><div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" /></td></tr>
                                                ) : series?.length === 0 ? (
                                                    <tr><td colSpan={4} className="px-8 py-24 text-center text-muted-foreground">No series found.</td></tr>
                                                ) : series?.map((item) => (
                                                    <tr key={item.id} className="hover:bg-accent/[0.02] transition-colors group">
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-semibold group-hover:text-accent transition-colors">{item.title}</span>
                                                                <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">{item.description}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className="font-medium">{item.author?.display_name || 'Anonymous'}</span>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="scale-75 origin-left">
                                                                {getStatusBadge((item as any).status || 'pending')}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                {(item as any).status !== 'approved' && (
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 rounded-lg text-emerald-500 hover:bg-emerald-500/10"
                                                                        onClick={() => handleApproveSeries(item.id)}
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" asChild>
                                                                    <Link to={`/blog/series/edit/${item.id}`}>
                                                                        <Edit className="w-4 h-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
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
                            </div>
                        )}

                        {currentSection === 'library' && (
                            <div className="space-y-10 gentle-reveal">
                                <header className="border-b border-border/40 pb-6">
                                    <h2 className="text-2xl font-bold tracking-tight">Resource Assets</h2>
                                    <p className="text-sm text-muted-foreground">Digital files and documentation library.</p>
                                </header>
                                <div className="soft-glass rounded-3xl p-8 border border-border/40 subtle-shadow">
                                    <ManageResources />
                                </div>
                            </div>
                        )}

                        {currentSection === 'marketplace' && (
                            <div className="space-y-10 gentle-reveal">
                                <header className="border-b border-border/40 pb-6">
                                    <h2 className="text-2xl font-bold tracking-tight text-primary">Marketplace items</h2>
                                    <p className="text-sm text-muted-foreground">Manage templates, source code and digital products.</p>
                                </header>
                                <div className="soft-glass rounded-3xl p-8 border border-border/40 subtle-shadow">
                                    <ManageProducts />
                                </div>
                            </div>
                        )}

                        {currentSection === 'users' && (
                            <div className="h-[60vh] flex items-center justify-center gentle-reveal">
                                <div className="text-center max-w-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6 text-muted-foreground/60">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">Member Profiles</h2>
                                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                        User directory and security permissions are currently undergoing maintenance.
                                    </p>
                                    <Button variant="outline" className="rounded-xl px-8 border-border/60" onClick={() => setCurrentSection('posts')}>
                                        Escape to Hub
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
};



export default Admin;
