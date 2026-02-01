import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { updatePassword } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);
        const { error } = await updatePassword(password);

        if (error) {
            toast.error('Lỗi khi cập nhật mật khẩu: ' + error.message);
        } else {
            setIsSuccess(true);
            toast.success('Mật khẩu đã được cập nhật thành công!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Code2 className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold gradient-text">DevHub</span>
                </Link>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    {!isSuccess ? (
                        <>
                            <h1 className="text-2xl font-bold mb-2 text-center">Đặt lại mật khẩu</h1>
                            <p className="text-muted-foreground mb-8 text-center text-sm">
                                Vui lòng nhập mật khẩu mới của bạn để hoàn tất quá trình khôi phục tài khoản.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Xác nhận mật khẩu mới</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="gradient"
                                    className="w-full py-6 text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Thành công!</h2>
                            <p className="text-muted-foreground mb-8 text-sm">
                                Mật khẩu của bạn đã được cập nhật thành công. Bạn đang được chuyển hướng đến trang đăng nhập trong giây lát...
                            </p>
                            <Button asChild variant="gradient" className="w-full">
                                <Link to="/login">Đến trang đăng nhập ngay</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
