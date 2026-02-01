import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Lock, Mail, Loader2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn, isAdmin, loading, user } = useAuth();
    const navigate = useNavigate();

    // If already an admin, go to dashboard
    if (!loading && user && isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await signIn(email, password);
            if (error) {
                toast.error('Đăng nhập thất bại: ' + error.message);
            } else {
                // Wait a bit for profile to load and isAdmin to update
                toast.success('Đang xác thực quyền Admin...');
                setTimeout(() => {
                    // We'll let the useEffect/Navigate handle the redirection
                    // if isAdmin becomes true
                }, 1000);
            }
        } catch (err) {
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse" />

            <Button
                variant="ghost"
                className="absolute top-8 left-8 gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/')}
            >
                <ChevronLeft className="w-4 h-4" />
                Quay lại trang chủ
            </Button>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Cổng Quản Trị</h1>
                    <p className="text-muted-foreground mt-2">Dành riêng cho quản trị viên hệ thống</p>
                </div>

                <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Đăng nhập Admin</CardTitle>
                        <CardDescription>Nhập thông tin xác thực để bắt đầu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Admin</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@codeconnect.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang đăng nhập...
                                    </>
                                ) : 'Đăng nhập vào Dashboard'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t border-border/50 pt-6">
                        <p className="text-xs text-center text-muted-foreground">
                            Truy cập trái phép vào hệ thống quản trị là vi phạm chính sách của chúng tôi.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;
