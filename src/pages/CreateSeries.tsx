import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    Image as ImageIcon,
    Tag as TagIcon,
    Send,
    ChevronLeft,
    Clock,
    Target,
    BarChart3,
    Sparkles,
    Info,
    User
} from 'lucide-react';
import { useCreateSeries } from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const CreateSeries: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const createSeries = useCreateSeries();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        difficulty: 'beginner',
        target_audience: '',
        estimated_duration: '',
        tags: '',
        thumbnail_url: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error('Vui lòng điền đầy đủ tiêu đề và mô tả');
            return;
        }

        try {
            await createSeries.mutateAsync({
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            });
            navigate('/blog');
        } catch (error: any) {
            // Error handled in hook
        }
    };

    const categories = [
        { id: 'frontend', name: 'Frontend' },
        { id: 'backend', name: 'Backend' },
        { id: 'devops', name: 'DevOps' },
        { id: 'mobile', name: 'Mobile' },
        { id: 'ai-ml', name: 'AI/ML' },
        { id: 'general', name: 'Chung' },
    ];

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2 hover:bg-muted"
                    asChild
                >
                    <Link to="/blog">
                        <ChevronLeft className="w-4 h-4" /> Quay lại Blog
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Layers className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Xây dựng Series mới</h1>
                            <p className="text-muted-foreground mt-1">
                                Tổ chức kiến thức của bạn thành một chuỗi bài học bài bản
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card className="border-border/50 shadow-lg overflow-hidden border-t-4 border-t-primary">
                            <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" /> Thông tin cốt lõi
                                </CardTitle>
                                <CardDescription>Đặt nền móng cho series chuyên sâu của bạn</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Tiêu đề Series</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="VD: Lộ trình trở thành Senior Frontend Engineer..."
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="text-xl font-bold py-7 focus:ring-4 focus:ring-primary/10 border-border/80 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Giới thiệu tổng quan</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Tóm tắt những gì người đọc sẽ đạt được sau khi hoàn thành series này..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="min-h-[180px] focus:ring-4 focus:ring-primary/10 border-border/80 text-base leading-relaxed rounded-xl"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Chuyên mục</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(v) => handleSelectChange('category', v)}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl border-border/80">
                                                <SelectValue placeholder="Chọn chuyên mục" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {categories.map(cat => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Mức độ khó</Label>
                                        <Select
                                            value={formData.difficulty}
                                            onValueChange={(v) => handleSelectChange('difficulty', v)}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl border-border/80">
                                                <SelectValue placeholder="Chọn mức độ" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="beginner">Cơ bản (Beginner)</SelectItem>
                                                <SelectItem value="intermediate">Trung cấp (Intermediate)</SelectItem>
                                                <SelectItem value="advanced">Nâng cao (Advanced)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-lg overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50 p-6">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" /> Chi tiết bổ sung
                                </CardTitle>
                                <CardDescription>Giúp người đọc hiểu hơn về kế hoạch của bạn</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="target_audience" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" /> Đối tượng hướng tới
                                        </Label>
                                        <Input
                                            id="target_audience"
                                            name="target_audience"
                                            placeholder="VD: Web developers, Sinh viên CNTT..."
                                            value={formData.target_audience}
                                            onChange={handleInputChange}
                                            className="h-12 rounded-xl border-border/80"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="estimated_duration" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" /> Thời gian ước tính
                                        </Label>
                                        <Input
                                            id="estimated_duration"
                                            name="estimated_duration"
                                            placeholder="VD: 5 bài học / 2 tuần..."
                                            value={formData.estimated_duration}
                                            onChange={handleInputChange}
                                            className="h-12 rounded-xl border-border/80"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="tags" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                        <TagIcon className="w-3.5 h-3.5" /> Thẻ (Tags) - Phân cách bởi dấu phẩy
                                    </Label>
                                    <Input
                                        id="tags"
                                        name="tags"
                                        placeholder="JavaScript, React, Fullstack..."
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="h-12 rounded-xl border-border/80"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="thumbnail_url" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                        <ImageIcon className="w-3.5 h-3.5" /> Ảnh bìa Series (URL)
                                    </Label>
                                    <Input
                                        id="thumbnail_url"
                                        name="thumbnail_url"
                                        placeholder="Dán link ảnh tại đây (Unsplash, Imgur...)"
                                        value={formData.thumbnail_url}
                                        onChange={handleInputChange}
                                        className="h-12 rounded-xl border-border/80"
                                    />
                                    {formData.thumbnail_url && (
                                        <div className="mt-4 rounded-2xl overflow-hidden aspect-video bg-muted border-2 border-primary/20 shadow-md">
                                            <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between p-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border border-primary/20 shadow-inner group">
                            <div className="flex gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-card flex items-center justify-center flex-shrink-0 text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <Send className="w-7 h-7" />
                                </div>
                                <div className="max-w-md">
                                    <h4 className="font-bold text-lg">Gửi xét duyệt</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Sau khi tạo, Series của bạn sẽ được gửi tới Admin để phê duyệt tính hợp lệ trước khi được hiển thị công khai.
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                variant="gradient"
                                className="gap-3 px-10 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-shadow"
                                disabled={createSeries.isPending}
                            >
                                {createSeries.isPending ? 'Đang khởi tạo...' : 'Khởi tạo Series'}
                            </Button>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" /> Mẹo tạo Series
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Tiêu đề đậm chất:</span> Gợi cảm hứng và mô tả rõ mục tiêu.</p>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Phân tích rõ ràng:</span> Hãy cho người đọc biết tại sao họ nên theo dõi series này.</p>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Thumbnail chất lượng:</span> Một bức ảnh đẹp giúp series của bạn chuyên nghiệp hơn.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" /> Tại sao nên dùng Series?
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Series giúp người đọc dễ dàng theo dõi các bài viết liên quan theo đúng thứ tự logic, tăng khả năng quay lại xem bài tiếp theo của user.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default CreateSeries;

