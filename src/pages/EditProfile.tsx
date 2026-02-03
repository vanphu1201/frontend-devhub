import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile, useUpdateProfile, useUploadAvatar, useUploadCover } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import {
    User,
    Github,
    Twitter,
    Linkedin,
    Globe,
    MapPin,
    X,
    Plus,
    Loader2,
    Camera,
    Image as ImageIcon,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: profile, isLoading } = useProfile(user?.id);
    const updateProfile = useUpdateProfile();
    const uploadAvatar = useUploadAvatar();
    const uploadCover = useUploadCover();

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        display_name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        github_username: '',
        twitter_username: '',
        linkedin_username: '',
        avatar_url: '',
        cover_url: '',
        skills: [] as string[]
    });

    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                display_name: profile.display_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
                location: profile.location || '',
                website: profile.website || '',
                github_username: profile.github_username || '',
                twitter_username: profile.twitter_username || '',
                linkedin_username: profile.linkedin_username || '',
                avatar_url: profile.avatar_url || '',
                cover_url: profile.cover_url || '',
                skills: profile.skills || []
            });
        }
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile.mutateAsync(formData);
        navigate('/profile');
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadAvatar.mutateAsync(file);
            setFormData(prev => ({ ...prev, avatar_url: url }));
        }
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadCover.mutateAsync(file);
            setFormData(prev => ({ ...prev, cover_url: url }));
        }
    };

    const addSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill] });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ</h1>
                            <p className="text-muted-foreground">Cập nhật thông tin cá nhân và hình ảnh của bạn</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Visuals - Cover & Avatar */}
                    <div className="space-y-4">
                        <div className="relative">
                            {/* Cover Image */}
                            <div className="relative h-48 w-full rounded-2xl bg-muted overflow-hidden border-2 border-border/50 group">
                                {formData.cover_url ? (
                                    <img src={formData.cover_url} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                        <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => coverInputRef.current?.click()}
                                        disabled={uploadCover.isPending}
                                    >
                                        {uploadCover.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                        Thay đổi ảnh bìa
                                    </Button>
                                </div>
                                <input
                                    type="file"
                                    ref={coverInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                />
                            </div>

                            {/* Avatar Image */}
                            <div className="absolute -bottom-10 left-8">
                                <div className="relative w-32 h-32 rounded-3xl border-4 border-background bg-card overflow-hidden group shadow-xl">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                                            {formData.display_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="rounded-full w-10 h-10"
                                            onClick={() => avatarInputRef.current?.click()}
                                            disabled={uploadAvatar.isPending}
                                        >
                                            {uploadAvatar.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="h-10" /> {/* Spacer for avatar overflow */}
                    </div>

                    {/* Identity Info */}
                    <Card className="border-border/50 shadow-sm mt-12">
                        <CardHeader>
                            <CardTitle>Danh tính & Giới thiệu</CardTitle>
                            <CardDescription>Mọi người sẽ biết đến bạn qua những thông tin này.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="display_name">Tên hiển thị</Label>
                                    <Input
                                        id="display_name"
                                        value={formData.display_name}
                                        onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username (@)</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                        placeholder="vanya_dev"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Tiểu sử</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Chia sẻ niềm đam mê lập trình của bạn..."
                                    className="min-h-[120px] resize-none"
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> Địa điểm
                                    </Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Thành phố, Quốc gia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="flex items-center gap-1">
                                        <Globe className="w-4 h-4" /> Website công việc
                                    </Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Liên kết cộng đồng</CardTitle>
                            <CardDescription>Giúp các nhà tuyển dụng và đồng nghiệp tìm thấy bạn.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="github" className="flex items-center gap-1">
                                        <Github className="w-4 h-4" /> GitHub
                                    </Label>
                                    <Input
                                        id="github"
                                        value={formData.github_username}
                                        onChange={e => setFormData({ ...formData, github_username: e.target.value })}
                                        placeholder="username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter" className="flex items-center gap-1">
                                        <Twitter className="w-4 h-4" /> Twitter/X
                                    </Label>
                                    <Input
                                        id="twitter"
                                        value={formData.twitter_username}
                                        onChange={e => setFormData({ ...formData, twitter_username: e.target.value })}
                                        placeholder="username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin" className="flex items-center gap-1">
                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                    </Label>
                                    <Input
                                        id="linkedin"
                                        value={formData.linkedin_username}
                                        onChange={e => setFormData({ ...formData, linkedin_username: e.target.value })}
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Kỹ năng chuyên môn</CardTitle>
                            <CardDescription>Bạn giỏi nhất ở lĩnh vực nào?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-2 p-4 rounded-xl bg-muted/30 min-h-[60px] items-center border border-dashed">
                                {formData.skills.length > 0 ? (
                                    formData.skills.map(skill => (
                                        <Badge key={skill} variant="tech" className="gap-1 pl-3 pr-1 py-1 group select-none">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">Hãy thêm những kỹ năng làm nên thương hiệu của bạn</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    placeholder="Thêm kỹ năng mới (nhấn Enter)"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                />
                                <Button type="button" variant="outline" onClick={addSkill} className="gap-2">
                                    <Plus className="w-4 h-4" /> Thêm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/profile')}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            className="px-12 min-w-[200px] h-11 text-lg font-semibold shadow-lg shadow-primary/20"
                            disabled={updateProfile.isPending}
                        >
                            {updateProfile.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : 'Cập nhật hồ sơ'}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditProfile;
