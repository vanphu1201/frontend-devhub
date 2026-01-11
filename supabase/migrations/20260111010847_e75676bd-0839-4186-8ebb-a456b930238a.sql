-- Fix function search_path for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Insert default badges
INSERT INTO public.badges (name, description, icon, type, points_required) VALUES
('Early Adopter', 'Người dùng đầu tiên của DevHub', '🚀', 'bronze', 0),
('First Post', 'Đăng bài viết đầu tiên', '📝', 'bronze', 0),
('100 Posts', 'Đăng 100 bài viết', '✍️', 'silver', 100),
('Bug Hunter', 'Phát hiện và báo cáo lỗi', '🐛', 'silver', 50),
('Top Contributor', 'Người đóng góp tích cực', '🏆', 'gold', 500),
('JavaScript Expert', 'Chuyên gia JavaScript', '⚡', 'gold', 300),
('React Master', 'Thành thạo React', '⚛️', 'gold', 300),
('Mentor', 'Hướng dẫn người mới', '🎓', 'silver', 200),
('Streak 30', 'Hoạt động 30 ngày liên tục', '🔥', 'bronze', 30);