import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    BookOpen,
    Image as ImageIcon,
    Tag as TagIcon,
    Layers,
    Save,
    Eye,
    Edit3,
    ChevronLeft,
    Loader2,
    HelpCircle,
    Info,
    Sparkles,
    Code,
    MessageSquare
} from 'lucide-react';
import { useBlogPost, useUpdateBlogPost, useSeries } from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import ContentRenderer from '@/components/ui/ContentRenderer';
import MarkdownToolbar from '@/components/blog/MarkdownToolbar';
import { toast } from 'sonner';

const EditBlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin, user, loading: authLoading } = useAuth();
    const { data: post, isLoading: postLoading } = useBlogPost(id || '');
    const { data: series } = useSeries();
    const updateBlogPost = useUpdateBlogPost();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'frontend',
        tags: '',
        thumbnail_url: '',
        series_id: '',
        status: 'pending' as 'pending' | 'approved' | 'rejected',
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                content: post.content || '',
                excerpt: post.excerpt || '',
                category: post.category || 'frontend',
                tags: (post.tags || []).join(', '),
                thumbnail_url: post.thumbnail_url || '',
                series_id: post.series_id || '',
                status: (post as any).status || 'pending',
            });
        }
    }, [post]);

    const categories = [
        { id: 'frontend', name: 'Frontend' },
        { id: 'backend', name: 'Backend' },
        { id: 'devops', name: 'DevOps' },
        { id: 'mobile', name: 'Mobile' },
        { id: 'ai-ml', name: 'AI/ML' },
        { id: 'general', name: 'Chung' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleSeriesChange = (value: string) => {
        setFormData(prev => ({ ...prev, series_id: value === 'none' ? '' : value }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value as any }));
    };

    const handleInsertMarkdown = (insertedText: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = formData.content;

        const newContent =
            currentContent.substring(0, start) +
            insertedText +
            currentContent.substring(end);

        setFormData(prev => ({ ...prev, content: newContent }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung');
            return;
        }

        try {
            await updateBlogPost.mutateAsync({
                id: id!,
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt,
                category: formData.category,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                thumbnail_url: formData.thumbnail_url,
                series_id: formData.series_id || undefined,
                status: formData.status,
            });
            navigate(isAdmin ? '/admin' : '/blog');
        } catch (error: any) {
            // error handled in hook
        }
    };

    if (postLoading || authLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!isAdmin && post?.user_id !== user?.id) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Bạn không có quyền chỉnh sửa bài viết này</h2>
                    <Button asChild variant="outline">
                        <Link to="/blog">Quay lại Blog</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2 hover:bg-muted"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-4 h-4" /> Quay lại
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                <Edit3 className="w-6 h-6" />
                            </div>
                            Chỉnh sửa bài viết
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Cập nhật nội dung với công cụ hỗ trợ Markdown chuyên nghiệp
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    <div className="space-y-8">
                        <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden border-t-4 border-t-primary">
                            <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" /> Soạn thảo nội dung
                                </CardTitle>
                                <CardDescription>Trình soạn thảo hỗ trợ Markdown đầy đủ tính năng</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-8 space-y-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Tiêu đề bài viết</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="VD: Tiêu đề bài viết..."
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="text-2xl font-bold py-8 focus:ring-4 focus:ring-primary/10 border-border/60 rounded-xl shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Nội dung chi tiết</Label>
                                        <Tabs defaultValue="write" className="w-full border rounded-2xl overflow-hidden border-border/60 shadow-inner bg-card">
                                            <div className="flex items-center justify-between bg-muted/30 border-b border-border/60">
                                                <TabsList className="bg-transparent h-12 rounded-none p-0">
                                                    <TabsTrigger value="write" className="h-full px-6 gap-2 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all">
                                                        <Edit3 className="w-4 h-4" /> Soạn thảo
                                                    </TabsTrigger>
                                                    <TabsTrigger value="preview" className="h-full px-6 gap-2 rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all">
                                                        <Eye className="w-4 h-4" /> Xem trước
                                                    </TabsTrigger>
                                                </TabsList>
                                                <div className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:block">
                                                    Đã bật Markdown
                                                </div>
                                            </div>

                                            <TabsContent value="write" className="m-0">
                                                <MarkdownToolbar
                                                    textareaId="content-editor"
                                                    onInsert={handleInsertMarkdown}
                                                />
                                                <Textarea
                                                    id="content-editor"
                                                    name="content"
                                                    ref={textareaRef}
                                                    placeholder="Sử dụng thanh công cụ hoặc viết mã Markdown tại đây..."
                                                    value={formData.content}
                                                    onChange={handleInputChange}
                                                    className="min-h-[600px] border-none focus-visible:ring-0 text-lg leading-relaxed resize-none rounded-none p-8 bg-transparent font-mono selection:bg-primary/20"
                                                />
                                            </TabsContent>

                                            <TabsContent value="preview" className="m-0 bg-muted/5">
                                                <div className="p-8 min-h-[600px] bg-background/50 backdrop-blur-[2px] overflow-y-auto">
                                                    {formData.content ? (
                                                        <ContentRenderer content={formData.content} />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground space-y-4">
                                                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                                                                <Eye className="w-8 h-8 opacity-20" />
                                                            </div>
                                                            <p className="italic font-medium">Nội dung xem trước sẽ xuất hiện tại đây</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-lg overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" /> Tóm tắt & Trích dẫn
                                </CardTitle>
                                <CardDescription>Xuất hiện ở các thẻ xem trước bài viết</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    placeholder="Viết một đoạn ngắn giới thiệu về bài viết này..."
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    className="min-h-[120px] focus:ring-4 focus:ring-primary/10 border-border/60 text-base rounded-xl"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="space-y-6">
                        <Card className="border-border/50 shadow-md sticky top-8">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-primary" /> Cấu hình & Xuất bản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isAdmin && (
                                    <div className="space-y-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Trạng thái (Admin)</Label>
                                        <Select value={formData.status} onValueChange={handleStatusChange}>
                                            <SelectTrigger className="h-10 rounded-lg border-primary/20 bg-background mt-1">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="pending">Đang chờ (Pending)</SelectItem>
                                                <SelectItem value="approved">Đã duyệt (Approved)</SelectItem>
                                                <SelectItem value="rejected">Từ chối (Rejected)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chuyên mục</Label>
                                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                                        <SelectTrigger className="h-11 rounded-xl border-border/60">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thẻ (Tags)</Label>
                                    <div className="relative">
                                        <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            name="tags"
                                            placeholder="React, NextJS..."
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            className="h-11 pl-9 rounded-xl border-border/60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ảnh bìa (URL)</Label>
                                    <Input
                                        name="thumbnail_url"
                                        placeholder="https://..."
                                        value={formData.thumbnail_url}
                                        onChange={handleInputChange}
                                        className="h-11 rounded-xl border-border/60"
                                    />
                                    {formData.thumbnail_url && (
                                        <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-muted border border-border/50 shadow-inner">
                                            <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thuộc Series</Label>
                                    <Select value={formData.series_id || 'none'} onValueChange={handleSeriesChange}>
                                        <SelectTrigger className="h-11 rounded-xl border-border/60">
                                            <SelectValue placeholder="Chọn series" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="none">Không thuộc series nào</SelectItem>
                                            {series?.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    className="w-full h-14 rounded-2xl gap-3 font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-accent"
                                    onClick={handleSubmit}
                                    disabled={updateBlogPost.isPending}
                                >
                                    {updateBlogPost.isPending ? 'Đang lưu...' : (
                                        <>
                                            <Save className="w-5 h-5" /> Lưu thay đổi
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-primary" /> Markdown Guide
                            </h4>
                            <div className="space-y-3 text-[13px]">
                                <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-[11px] space-y-1">
                                    <div className="text-primary font-bold"># Heading 1</div>
                                    <div>**In đậm**</div>
                                    <div>[Liên kết](url)</div>
                                    <div>- Danh sách</div>
                                </div>
                                <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-bold">
                                        <Info className="w-3.5 h-3.5" /> Thêm Alert
                                    </div>
                                    <div className="font-mono text-[10px] text-muted-foreground leading-tight">
                                        &gt; [!NOTE]<br />
                                        &gt; Nội dung lưu ý
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default EditBlogPost;
