import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, Mail, Lock, Eye, EyeOff, Github, Chrome, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }).max(100),
  email: z.string().trim().email({ message: 'Email không hợp lệ' }).max(255),
  password: z.string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(/[A-Z]/, { message: 'Mật khẩu phải có ít nhất 1 chữ hoa' })
    .regex(/[a-z]/, { message: 'Mật khẩu phải có ít nhất 1 chữ thường' })
    .regex(/[0-9]/, { message: 'Mật khẩu phải có ít nhất 1 số' }),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGithub, signInWithGoogle, user, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!agreeTerms) {
      toast.error('Vui lòng đồng ý với điều khoản dịch vụ');
      return;
    }

    // Validate input
    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, name);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('Email này đã được đăng ký');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      navigate('/');
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-6">
            Tham gia cộng đồng
            <span className="block gradient-text">Developer Việt Nam</span>
          </h2>
          
          <div className="space-y-4">
            {[
              { icon: '🚀', title: 'Kết nối', desc: 'Với hàng nghìn lập trình viên' },
              { icon: '📚', title: 'Học hỏi', desc: 'Từ blog, series và tài liệu chất lượng' },
              { icon: '💰', title: 'Kiếm tiền', desc: 'Bán template, source code của bạn' },
              { icon: '🏆', title: 'Phát triển', desc: 'Xây dựng danh tiếng và sự nghiệp' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 bg-card/50 rounded-xl">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">DevHub</span>
          </Link>

          <h1 className="text-2xl font-bold mb-2">Tạo tài khoản mới</h1>
          <p className="text-muted-foreground mb-8">
            Bắt đầu hành trình của bạn với DevHub
          </p>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="gap-2" onClick={signInWithGithub}>
              <Github className="w-5 h-5" />
              GitHub
            </Button>
            <Button variant="outline" className="gap-2" onClick={signInWithGoogle}>
              <Chrome className="w-5 h-5" />
              Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc đăng ký bằng email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border ${
                    errors.name ? 'border-destructive' : 'border-border'
                  } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border ${
                    errors.email ? 'border-destructive' : 'border-border'
                  } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2.5 rounded-lg bg-muted/50 border ${
                    errors.password ? 'border-destructive' : 'border-border'
                  } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
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
              {errors.password && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
              
              {/* Password Strength */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-1.5 rounded-full transition-colors ${
                          level <= strengthScore
                            ? strengthScore <= 2 ? 'bg-red-500' : strengthScore === 3 ? 'bg-yellow-500' : 'bg-green-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'hasMinLength', label: 'Ít nhất 8 ký tự' },
                      { key: 'hasUppercase', label: 'Có chữ hoa' },
                      { key: 'hasLowercase', label: 'Có chữ thường' },
                      { key: 'hasNumber', label: 'Có số' },
                    ].map((req) => (
                      <div 
                        key={req.key}
                        className={`flex items-center gap-1 ${
                          passwordStrength[req.key as keyof typeof passwordStrength] 
                            ? 'text-green-500' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 rounded border-border"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Điều khoản dịch vụ
                </Link>
                {' '}và{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              className="w-full" 
              disabled={isLoading || !agreeTerms}
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
