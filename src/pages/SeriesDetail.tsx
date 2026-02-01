import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    BookOpen,
    Calendar,
    Clock,
    Eye,
    Heart,
    MessageSquare,
    User,
    CheckCircle2
} from 'lucide-react';
import { useSeriesDetail } from '@/hooks/useBlogPosts';

const SeriesDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useSeriesDetail(id || '');

    if (isLoading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-64 bg-muted mx-auto rounded"></div>
                        <div className="h-4 w-96 bg-muted mx-auto rounded"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy Series</h2>
                    <Button asChild variant="outline">
                        <Link to="/blog">Quay lại Blog</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    const { series, posts } = data;

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
                    <span>Series</span>
                </div>

                {/* Series Header */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden mb-12 shadow-sm">
                    <div className="md:flex">
                        <div className="md:w-1/3 aspect-video md:aspect-square bg-muted">
                            <img
                                src={series.thumbnail_url || '/placeholder.svg'}
                                alt={series.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 p-6 md:p-10">
                            <Badge variant="gradient" className="mb-4">Series</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{series.title}</h1>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                {series.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {series.author?.display_name || 'Anonymous'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{posts.length} bài viết</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Cập nhật {new Date(series.updated_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(series.tags || []).map((tag: string) => (
                                    <Badge key={tag} variant="secondary">#{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts List */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Danh sách bài viết trong series</h2>
                    </div>

                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
                                Chưa có bài viết nào được đăng trong series này.
                            </div>
                        ) : posts.map((post, index) => (
                            <div key={post.id} className="relative pl-12 group">
                                {/* Timeline line */}
                                {index !== posts.length - 1 && (
                                    <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-border group-hover:bg-primary/30 transition-colors"></div>
                                )}

                                {/* Number bullet */}
                                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-primary z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    {index + 1}
                                </div>

                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="block bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {post.views_count || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    {post.likes_count || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />
                                                    {post.comments_count || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {post.read_time_minutes} phút
                                                </span>
                                            </div>
                                        </div>

                                        {post.thumbnail_url && (
                                            <div className="w-full md:w-32 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <img
                                                    src={post.thumbnail_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SeriesDetail;
