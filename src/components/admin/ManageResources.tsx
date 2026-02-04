import React, { useState } from 'react';
import {
    useAdminResources,
    useCreateResource,
    useUpdateResource,
    useDeleteResource,
    Resource
} from '@/hooks/useResources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    FileText,
    ExternalLink,
    Loader2,
    X,
    Save,
    CheckCircle2,
    Coins
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const ManageResources: React.FC = () => {
    const { data: resources, isLoading } = useAdminResources();
    const createResource = useCreateResource();
    const updateResource = useUpdateResource();
    const deleteResource = useDeleteResource();

    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'pdf' as 'pdf' | 'code' | 'image' | 'video',
        category: '',
        file_url: '',
        file_size: '',
        is_premium: false,
        price: 0,
        points_price: 0,
    });

    const handleOpenCreate = () => {
        setEditingResource(null);
        setFormData({
            title: '',
            description: '',
            type: 'pdf',
            category: 'frontend',
            file_url: '',
            file_size: '',
            is_premium: false,
            price: 0,
            points_price: 0,
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (resource: Resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title || '',
            description: resource.description || '',
            type: resource.type || 'pdf',
            category: resource.category || '',
            file_url: resource.file_url || '',
            file_size: resource.file_size || '',
            is_premium: resource.is_premium || false,
            price: resource.price || 0,
            points_price: resource.points_price || 0,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.type) {
            toast.error('Vui lòng điền tiêu đề và loại tài liệu');
            return;
        }

        try {
            if (editingResource) {
                await updateResource.mutateAsync({ id: editingResource.id, ...formData });
            } else {
                await createResource.mutateAsync(formData);
            }
            setIsDialogOpen(false);
        } catch (err) {
            // Handled in hook
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            await deleteResource.mutateAsync(id);
        }
    };

    const filteredResources = resources?.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm tài liệu..."
                        className="pl-10 h-10 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent">
                    <Plus className="w-4 h-4" />
                    Thêm tài liệu
                </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold">Tài liệu</th>
                                <th className="px-6 py-4 text-sm font-semibold">Loại</th>
                                <th className="px-6 py-4 text-sm font-semibold">Chuyên mục</th>
                                <th className="px-6 py-4 text-sm font-semibold">Thanh toán</th>
                                <th className="px-6 py-4 text-sm font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        <p className="mt-2 text-muted-foreground">Đang tải tài liệu...</p>
                                    </td>
                                </tr>
                            ) : filteredResources?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Không tìm thấy tài liệu nào
                                    </td>
                                </tr>
                            ) : filteredResources?.map((resource) => (
                                <tr key={resource.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium line-clamp-1">{resource.title}</span>
                                                <span className="text-xs text-muted-foreground">{resource.file_size || '---'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="uppercase text-[10px]">{resource.type}</Badge>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{resource.category || 'Chung'}</td>
                                    <td className="px-6 py-4">
                                        {resource.is_premium ? (
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="gradient" className="gap-1 whitespace-nowrap">
                                                    {resource.price?.toLocaleString()} VNĐ
                                                </Badge>
                                                <Badge variant="outline" className="gap-1 text-orange-500 border-orange-200 bg-orange-50 whitespace-nowrap">
                                                    <Coins className="w-3 h-3" />
                                                    {resource.points_price?.toLocaleString()} CP
                                                </Badge>
                                            </div>
                                        ) : (
                                            <Badge variant="success">Miễn phí</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenEdit(resource)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(resource.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            {resource.file_url && (
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                                                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingResource ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}</DialogTitle>
                        <DialogDescription>
                            Điền các thông tin cần thiết để đăng tải tài liệu lên thư viện.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề tài liệu</Label>
                            <Input
                                id="title"
                                placeholder="VD: React Patterns Cheatsheet"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Loại tài liệu</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="pdf">PDF</SelectItem>
                                        <SelectItem value="code">Source Code</SelectItem>
                                        <SelectItem value="image">Hình ảnh / Infographic</SelectItem>
                                        <SelectItem value="video">Video bài giảng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Chuyên mục</Label>
                                <Input
                                    id="category"
                                    placeholder="VD: Frontend"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả ngắn</Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả tóm tắt về tài liệu này..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="rounded-xl min-h-[100px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="file_url">Đường dẫn tệp (URL)</Label>
                                <Input
                                    id="file_url"
                                    placeholder="https://..."
                                    value={formData.file_url}
                                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file_size">Dung lượng</Label>
                                <Input
                                    id="file_size"
                                    placeholder="VD: 2.5 MB"
                                    value={formData.file_size}
                                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                            <div className="space-y-0.5">
                                <Label>Tài liệu Premium</Label>
                                <p className="text-xs text-muted-foreground">Chỉ dành cho người mua hoặc thành viên Pro</p>
                            </div>
                            <Switch
                                checked={formData.is_premium}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                            />
                        </div>
                        {formData.is_premium && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Giá bán (VNĐ)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="VD: 50000"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="points_price">Giá điểm (CP)</Label>
                                    <Input
                                        id="points_price"
                                        type="number"
                                        placeholder="VD: 50"
                                        value={formData.points_price}
                                        onChange={(e) => setFormData({ ...formData, points_price: Number(e.target.value) })}
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="gap-2 rounded-xl bg-gradient-to-r from-primary to-accent"
                                disabled={createResource.isPending || updateResource.isPending}
                            >
                                {createResource.isPending || updateResource.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {editingResource ? 'Lưu thay đổi' : 'Đăng tài liệu'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageResources;
