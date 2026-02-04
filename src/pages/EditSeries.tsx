import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Layers,
    Save,
    Image as ImageIcon,
    Tag as TagIcon,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { useSeriesDetail, useUpdateSeries } from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const EditSeries: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin, user, loading: authLoading } = useAuth();
    const { data, isLoading } = useSeriesDetail(id || '');
    const updateSeries = useUpdateSeries();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        thumbnail_url: '',
        status: 'pending' as 'pending' | 'approved' | 'rejected',
    });

    useEffect(() => {
        if (data?.series) {
            setFormData({
                title: data.series.title || '',
                description: data.series.description || '',
                tags: (data.series.tags || []).join(', '),
                thumbnail_url: data.series.thumbnail_url || '',
                status: (data.series as any).status || 'pending',
            });
        }
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, status: value as any }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error('Vui lòng điền đầy đủ tiêu đề và mô tả');
            return;
        }

        try {
            await updateSeries.mutateAsync({
                id: data!.series.id,
                title: formData.title,
                description: formData.description,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                thumbnail_url: formData.thumbnail_url,
                status: formData.status,
            });
            navigate(isAdmin ? '/admin' : '/blog');
        } catch (error: any) {
            // error handled in hook
        }
    };

    if (isLoading || authLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!isAdmin) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Trang này chỉ dành cho Quản trị viên</h2>
                    <p className="text-muted-foreground mb-8">Bạn không có quyền chỉnh sửa series này trực tiếp.</p>
                    <Button asChild variant="outline">
                        <Link to="/blog">Quay lại Blog</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2 hover:bg-muted"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-4 h-4" /> Quay lại
                </Button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Layers className="w-8 h-8 text-primary" />
                            Chỉnh sửa Series
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Cập nhật thông tin tập hợp bài viết của bạn
                        </p>
                    </div>
                    <Button
                        variant="gradient"
                        className="gap-2 px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
                        onClick={handleSubmit}
                        disabled={updateSeries.isPending}
                    >
                        {updateSeries.isPending ? 'Đang lưu...' : (
                            <>
                                <Save className="w-4 h-4" /> Lưu thay đổi
                            </>
                        )}
                    </Button>
                </div>

                <Card className="border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border/50">
                        <CardTitle className="text-lg">Thông tin Series</CardTitle>
                        <CardDescription>Cập nhật tên và mô tả hấp dẫn cho series của bạn</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {isAdmin && (
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    Trạng thái phê duyệt (Admin)
                                </Label>
                                <Select value={formData.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="rounded-xl border-primary/40 py-5 bg-primary/5">
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
                            <Label htmlFor="title" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tiêu đề Series</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="VD: Lộ trình trở thành Frontend Developer 2024"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="text-lg font-bold py-6 focus:ring-2 focus:ring-primary/20 border-border/60"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mô tả chi tiết</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Giới thiệu về nội dung mà series này sẽ truyền tải..."
                                value={formData.description}
                                onChange={handleInputChange}
                                className="min-h-[150px] focus:ring-2 focus:ring-primary/20 border-border/60 text-base"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <TagIcon className="w-3 h-3" /> Tags (cách nhau bởi dấu phẩy)
                                </Label>
                                <Input
                                    name="tags"
                                    placeholder="React, Frontend, Roadmap..."
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="rounded-xl border-border/60 py-5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> Ảnh bìa (URL)
                                </Label>
                                <Input
                                    name="thumbnail_url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.thumbnail_url}
                                    onChange={handleInputChange}
                                    className="rounded-xl border-border/60 py-5"
                                />
                            </div>
                        </div>

                        {formData.thumbnail_url && (
                            <div className="rounded-xl overflow-hidden aspect-video bg-muted border border-border/50 relative group">
                                <img src={formData.thumbnail_url} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">Xem trước ảnh bìa</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default EditSeries;
