import React, { useState } from 'react';
import {
    useAdminProducts,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
    Product
} from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Monitor,
    ExternalLink,
    Loader2,
    Save,
    Tag,
    Image as ImageIcon
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

const ManageProducts: React.FC = () => {
    const { data: products, isLoading } = useAdminProducts();
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        long_description: '',
        category: 'Dashboard',
        price: 0,
        original_price: null as number | null,
        tech_stack: [] as string[],
        preview_images: [] as string[],
        demo_url: '',
        documentation_url: '',
        download_url: '',
        version: '1.0.0',
        support_duration: '6 tháng',
        is_published: true,
        is_featured: false,
    });

    const [techStackInput, setTechStackInput] = useState('');
    const [previewImagesInput, setPreviewImagesInput] = useState('');

    const categories = [
        'Dashboard',
        'Landing Page',
        'E-commerce',
        'Admin Panel',
        'Portfolio',
        'Blog',
        'Mobile App',
    ];

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            long_description: '',
            category: 'Dashboard',
            price: 0,
            original_price: null,
            tech_stack: [],
            preview_images: [],
            demo_url: '',
            documentation_url: '',
            download_url: '',
            version: '1.0.0',
            support_duration: '6 tháng',
            is_published: true,
            is_featured: false,
        });
        setTechStackInput('');
        setPreviewImagesInput('');
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            long_description: product.long_description || '',
            category: product.category || 'Dashboard',
            price: product.price || 0,
            original_price: product.original_price || null,
            tech_stack: product.tech_stack || [],
            preview_images: product.preview_images || [],
            demo_url: product.demo_url || '',
            documentation_url: product.documentation_url || '',
            download_url: product.download_url || '',
            version: product.version || '1.0.0',
            support_duration: product.support_duration || '6 tháng',
            is_published: product.is_published ?? true,
            is_featured: product.is_featured ?? false,
        });
        setTechStackInput(product.tech_stack?.join(', ') || '');
        setPreviewImagesInput(product.preview_images?.join(', ') || '');
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Vui lòng điền tên sản phẩm');
            return;
        }

        const finalData = {
            ...formData,
            tech_stack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
            preview_images: previewImagesInput.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            if (editingProduct) {
                await updateProduct.mutateAsync({ id: editingProduct.id, ...finalData });
            } else {
                await createProduct.mutateAsync(finalData);
            }
            setIsDialogOpen(false);
        } catch (err) {
            // Handled in hook
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            await deleteProduct.mutateAsync(id);
        }
    };

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        className="pl-10 h-10 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent">
                    <Plus className="w-4 h-4" />
                    Đăng sản phẩm
                </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold">Sản phẩm</th>
                                <th className="px-6 py-4 text-sm font-semibold">Danh mục</th>
                                <th className="px-6 py-4 text-sm font-semibold">Giá</th>
                                <th className="px-6 py-4 text-sm font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 text-sm font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        <p className="mt-2 text-muted-foreground">Đang tải sản phẩm...</p>
                                    </td>
                                </tr>
                            ) : filteredProducts?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            ) : filteredProducts?.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                                {product.preview_images && product.preview_images[0] ? (
                                                    <img src={product.preview_images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Monitor className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium line-clamp-1">{product.name}</span>
                                                <div className="flex gap-1 mt-0.5">
                                                    {product.tech_stack?.slice(0, 2).map((tech, i) => (
                                                        <span key={i} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.price === 0 ? (
                                            <span className="text-emerald-500 font-semibold">Miễn phí</span>
                                        ) : (
                                            <span className="font-semibold">{product.price.toLocaleString()}đ</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {product.is_published ? (
                                                <Badge variant="success" className="w-fit">Công khai</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="w-fit">Nháp</Badge>
                                            )}
                                            {product.is_featured && (
                                                <Badge variant="gradient" className="w-fit text-[10px]">Nổi bật</Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenEdit(product)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            {product.demo_url && (
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                                                    <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
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
                <DialogContent className="sm:max-w-[700px] rounded-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Đăng sản phẩm mới'}</DialogTitle>
                        <DialogDescription>
                            Cung cấp thông tin chi tiết về template hoặc source code của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="name">Tên sản phẩm</Label>
                                <Input
                                    id="name"
                                    placeholder="VD: Modern Saas Dashboard"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="category">Danh mục</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả ngắn</Label>
                            <Input
                                id="description"
                                placeholder="Mô tả tóm tắt..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="long_description">Mô tả chi tiết (Markdown)</Label>
                            <Textarea
                                id="long_description"
                                placeholder="Mô tả chi tiết về sản phẩm, tính năng, cách cài đặt..."
                                value={formData.long_description}
                                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                                className="rounded-xl min-h-[150px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Giá bán (VNĐ)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0 = Miễn phí"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="original_price">Giá gốc (để hiển thị giảm giá)</Label>
                                <Input
                                    id="original_price"
                                    type="number"
                                    placeholder="Không bắt buộc"
                                    value={formData.original_price || ''}
                                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? Number(e.target.value) : null })}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="demo_url">Demo URL</Label>
                                <Input
                                    id="demo_url"
                                    placeholder="https://preview.your-site.com"
                                    value={formData.demo_url}
                                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="documentation_url">Documentation URL</Label>
                                <Input
                                    id="documentation_url"
                                    placeholder="https://docs.your-site.com"
                                    value={formData.documentation_url}
                                    onChange={(e) => setFormData({ ...formData, documentation_url: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="version">Phiên bản</Label>
                                <Input
                                    id="version"
                                    placeholder="1.0.0"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="support_duration">Thời hạn hỗ trợ</Label>
                                <Select
                                    value={formData.support_duration}
                                    onValueChange={(v) => setFormData({ ...formData, support_duration: v })}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Chọn thời hạn" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Không hỗ trợ">Không hỗ trợ</SelectItem>
                                        <SelectItem value="6 tháng">6 tháng</SelectItem>
                                        <SelectItem value="12 tháng">12 tháng</SelectItem>
                                        <SelectItem value="Trọn đời">Trọn đời</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="download_url">Download URL</Label>
                                <Input
                                    id="download_url"
                                    placeholder="https://storage.com/file.zip (VD: Google Drive, Dropbox...)"
                                    value={formData.download_url}
                                    onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Tech Stack (Cách nhau bằng dấu phẩy)</Label>
                            <Input
                                placeholder="React, Tailwind, Supabase"
                                value={techStackInput}
                                onChange={(e) => setTechStackInput(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Hình ảnh Preview (URL, cách nhau bằng dấu phẩy)</Label>
                            <Textarea
                                id="preview_images"
                                placeholder="https://image1.jpg, https://image2.jpg"
                                value={previewImagesInput}
                                onChange={(e) => setPreviewImagesInput(e.target.value)}
                                className="rounded-xl min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                                <div className="space-y-0.5">
                                    <Label>Công khai</Label>
                                    <p className="text-[10px] text-muted-foreground">Sản phẩm sẽ hiện trên marketplace</p>
                                </div>
                                <Switch
                                    checked={formData.is_published}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                                <div className="space-y-0.5">
                                    <Label>Nổi bật (Featured)</Label>
                                    <p className="text-[10px] text-muted-foreground">Ghim lên đầu trang marketplace</p>
                                </div>
                                <Switch
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="gap-2 rounded-xl bg-gradient-to-r from-primary to-accent"
                                disabled={createProduct.isPending || updateProduct.isPending}
                            >
                                {createProduct.isPending || updateProduct.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {editingProduct ? 'Lưu thay đổi' : 'Đăng sản phẩm'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default ManageProducts;
