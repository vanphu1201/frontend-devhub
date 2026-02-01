-- SQL script mở rộng để test tính năng lọc (Filter) của Blog
-- Đã sử dụng ID người dùng của bạn: fd46fb38-569e-46ae-8cd2-0edd32c1ce87

-- Xóa dữ liệu cũ để tránh trùng lặp slug (Tùy chọn, hãy cẩn thận)
-- DELETE FROM blog_posts WHERE user_id = 'fd46fb38-569e-46ae-8cd2-0edd32c1ce87';
-- DELETE FROM series WHERE user_id = 'fd46fb38-569e-46ae-8cd2-0edd32c1ce87';

-----------------------------------------------------------
-- 1. SERIES MỚI
-----------------------------------------------------------

INSERT INTO series (user_id, title, slug, description, thumbnail_url, tags, is_published, status) 
VALUES 
('fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 'DevOps cho Newbie', 'devops-cho-newbie', 'Hành trình từ Zero đến Jenkins/Docker/K8s.', 'https://images.unsplash.com/photo-1667372395872-5011a8837429?w=800', ARRAY['DevOps', 'CI/CD', 'Docker'], true, 'approved'),
('fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 'Lập trình Mobile với Flutter', 'flutter-mobile-mastery', 'Xây dựng ứng dụng đa nền tảng hiệu năng cao.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', ARRAY['Mobile', 'Flutter', 'Dart'], true, 'approved'),
('fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 'Thế giới Generative AI', 'generative-ai-world', 'Tìm hiểu về LLM và cách ứng dụng vào thực tế.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', ARRAY['AI', 'ML', 'LLM'], true, 'approved');

-----------------------------------------------------------
-- 2. BÀI VIẾT ĐA DẠNG CÁC DANH MỤC
-----------------------------------------------------------

INSERT INTO blog_posts (user_id, title, slug, excerpt, content, thumbnail_url, category, tags, is_published, is_featured, status, series_id, series_order, read_time_minutes, views_count, likes_count, comments_count) 
VALUES 
-- DEVOPS
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'Dockerize ứng dụng React chỉ trong 5 phút', 
  'dockerize-react-app-5-mins', 
  'Hướng dẫn từng bước cách đóng gói ứng dụng React bằng Docker.', 
  '# Docker Guide\n\nDocker giúp nhất quán môi trường phát triển...', 
  'https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800', 
  'devops', 
  ARRAY['Docker', 'React', 'DevOps'], 
  true, false, 'approved', 
  (SELECT id FROM series WHERE slug = 'devops-cho-newbie' LIMIT 1), 1, 
  5, 4500, 120, 15
),
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'CI/CD với GitHub Actions cho dự án Node.js', 
  'cicd-github-actions-nodejs', 
  'Tự động hóa quy trình test và deploy ứng dụng của bạn.', 
  '# CI/CD\n\nTiết kiệm thời gian với quy trình tự động hóa...', 
  'https://images.unsplash.com/photo-1618401471353-b98aadebc25e?w=800', 
  'devops', 
  ARRAY['CI/CD', 'GitHub', 'Node.js'], 
  true, false, 'approved', 
  (SELECT id FROM series WHERE slug = 'devops-cho-newbie' LIMIT 1), 2, 
  8, 3800, 95, 8
),

-- MOBILE
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'Tại sao nên chọn Flutter vào năm 2024?', 
  'why-flutter-in-2024', 
  'So sánh Flutter với React Native và Native App.', 
  '# Flutter vs Others\n\nFlutter đang ngày càng mạnh mẽ với khả năng render 120fps...', 
  'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800', 
  'mobile', 
  ARRAY['Flutter', 'Mobile Development'], 
  true, true, 'approved', 
  (SELECT id FROM series WHERE slug = 'flutter-mobile-mastery' LIMIT 1), 1, 
  7, 6200, 310, 45
),
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'Quản lý State trong Flutter với Riverpod', 
  'state-management-flutter-riverpod', 
  'Hướng dẫn sử dụng Riverpod để quản lý logic ứng dụng mượt mà.', 
  '# Riverpod\n\nThay thế Provider với kiến trúc hiện đại hơn...', 
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 
  'mobile', 
  ARRAY['Flutter', 'State Management'], 
  true, false, 'approved', 
  (SELECT id FROM series WHERE slug = 'flutter-mobile-mastery' LIMIT 1), 2, 
  12, 2900, 88, 12
),

-- AI/ML
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'Bắt đầu với Prompt Engineering', 
  'getting-started-prompt-engineering', 
  'Cách giao tiếp với AI hiệu quả để nhận được kết quả mong muốn.', 
  '# Tips for Prompts\n\nHãy mô tả rõ vai trò và bối cảnh cho AI...', 
  'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800', 
  'ai-ml', 
  ARRAY['AI', 'Prompt Engineering'], 
  true, true, 'approved', 
  (SELECT id FROM series WHERE slug = 'generative-ai-world' LIMIT 1), 1, 
  6, 8500, 520, 89
),
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'Ứng dụng LangChain trong xây dựng Chatbot', 
  'langchain-chatbot-apps', 
  'Kết nối LLM với dữ liệu riêng của bạn để tạo chatbot thông minh.', 
  '# LangChain\n\nLangChain giúp xâu chuỗi các tác vụ AI phức tạp...', 
  'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=800', 
  'ai-ml', 
  ARRAY['LangChain', 'Python', 'AI'], 
  true, false, 'approved', 
  (SELECT id FROM series WHERE slug = 'generative-ai-world' LIMIT 1), 2, 
  15, 5400, 245, 34
),

-- BACKEND (Thêm bài viết lẻ)
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'PostgreSQL vs MongoDB: Nên chọn cái nào?', 
  'postgresql-vs-mongodb', 
  'Phân tích ưu nhược điểm của RDBMS và NoSQL.', 
  '# Database Comparison\n\nLựa chọn phụ thuộc vào cấu trúc dữ liệu của bạn...', 
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800', 
  'backend', 
  ARRAY['Database', 'PostgreSQL', 'MongoDB'], 
  true, false, 'approved', 
  NULL, NULL, 10, 3100, 115, 21
),
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', 
  'Bảo mật API dự án Node.js với JWT', 
  'secure-api-nodejs-jwt', 
  'Cách triển khai xác thực người dùng an toàn.', 
  '# Security First\n\nĐừng bao giờ lưu password dạng plain text...', 
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', 
  'backend', 
  ARRAY['Security', 'JWT', 'Node.js'], 
  true, false, 'approved', 
  NULL, NULL, 11, 4200, 167, 28
);
