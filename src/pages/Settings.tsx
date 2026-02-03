import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import {
    User,
    Settings as SettingsIcon,
    Github,
    Twitter,
    Linkedin,
    Globe,
    MapPin,
    X,
    Plus,
    Loader2,
    Lock,
    Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <SettingsIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Cài đặt</h1>
                        <p className="text-muted-foreground">Quản lý các thiết lập tài khoản và bảo mật của bạn</p>
                    </div>
                </div>

                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 w-full sm:w-auto h-auto flex flex-wrap gap-1">
                        <TabsTrigger value="account" className="flex-1 sm:flex-none gap-2 px-6 py-2.5 text-base">
                            <Lock className="w-4 h-4" />
                            Tài khoản & Bảo mật
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex-1 sm:flex-none gap-2 px-6 py-2.5 text-base">
                            <Bell className="w-4 h-4" />
                            Thông báo
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="space-y-6">
                        <PasswordChangeForm />
                        <Card className="border-border/50 shadow-sm border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                <h2 className="text-xl font-bold mb-2">Các thiết lập khác</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Xác thực hai lớp và quản lý phiên đăng nhập sẽ sớm ra mắt.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-6 gap-2"
                                    onClick={() => navigate('/edit-profile')}
                                >
                                    <User className="w-4 h-4" />
                                    Chỉnh sửa hồ sơ cá nhân
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="border-border/50 shadow-sm border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                                    <Bell className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Cài đặt thông báo</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Tùy chỉnh cách bạn nhận thông báo từ cộng đồng CodeConnect. Sẽ sớm ra mắt!
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

const PasswordChangeForm = () => {
    const { updatePassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        if (passwords.new.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        const { error } = await updatePassword(passwords.new);
        setIsLoading(false);

        if (error) {
            toast.error('Lỗi cập nhật mật khẩu: ' + error.message);
        } else {
            toast.success('Cập nhật mật khẩu thành công!');
            setPasswords({ new: '', confirm: '' });
        }
    };

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Đổi mật khẩu
                </CardTitle>
                <CardDescription>Đảm bảo tài khoản của bạn luôn được bảo mật với mật khẩu mạnh.</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="password-form" onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={passwords.new}
                            onChange={e => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={passwords.confirm}
                            onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                            placeholder="••••••••"
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t py-4">
                <Button
                    type="submit"
                    form="password-form"
                    disabled={isLoading || !passwords.new}
                    variant="gradient"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Cập nhật mật khẩu
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Settings;
