import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ForgotPassword: React.FC = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Vui lòng nhập email');
            return;
        }

        setIsLoading(true);
        const { error } = await resetPassword(email);

        if (error) {
            toast.error('Lỗi khi gửi yêu cầu: ' + error.message);
        } else {
            setIsSubmitted(true);
            toast.success('Yêu cầu đặt lại mật khẩu đã được gửi!');
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
                    {!isSubmitted ? (
                        <>
                            <h1 className="text-2xl font-bold mb-2 text-center">Quên mật khẩu?</h1>
                            <p className="text-muted-foreground mb-8 text-center text-sm">
                                Đừng lo lắng! Hãy nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email của bạn</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="gradient"
                                    className="w-full py-6 text-base group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang gửi...' : (
                                        <>
                                            Gửi link đặt lại mật khẩu
                                            <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Kiểm tra email của bạn</h2>
                            <p className="text-muted-foreground mb-8 text-sm">
                                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (và cả thư rác).
                            </p>
                            <Button variant="outline" className="w-full mb-4" onClick={() => setIsSubmitted(false)}>
                                Thử lại với email khác
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-border flex justify-center">
                        <Link to="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
