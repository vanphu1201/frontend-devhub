-- SQL script to insert test data for Blog and Series features
-- IMPORTANT: Replace 'YOUR_USER_ID' with a valid UUID from your 'profiles' table.
-- You can find your user ID by running: SELECT id FROM profiles LIMIT 1;

-- 1. Create a Test Series
INSERT INTO series (
  user_id,
  title,
  slug,
  description,
  thumbnail_url,
  tags,
  is_published,
  status
) VALUES (
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', -- REPLACEME
  'Làm chủ React Performance 2024',
  'lam-chu-react-performance-2024',
  'Series hướng dẫn chuyên sâu về cách tối ưu hóa hiệu năng cho các ứng dụng React quy mô lớn.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
  ARRAY['React', 'Performance', 'Optimization'],
  true,
  'approved'
);

-- Get the ID of the series we just created (assuming it's the latest one for this user)
-- In a real SQL editor, you might want to copy the ID manually if this script is run in parts.

-- 2. Insert Blog Posts for the Series
INSERT INTO blog_posts (
  user_id,
  title,
  slug,
  excerpt,
  content,
  thumbnail_url,
  category,
  tags,
  is_published,
  is_featured,
  status,
  series_id,
  series_order,
  read_time_minutes,
  views_count,
  likes_count,
  comments_count
) VALUES 
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', -- REPLACEME
  'Tối ưu Render trong React với memo và useMemo',
  'toi-uu-render-react-memo-usememo',
  'Tìm hiểu cách sử dụng memo và useMemo để tránh re-render không cần thiết và cải thiện tốc độ ứng dụng.',
  '# Giới thiệu\n\nTrong React, re-render là một trong những nguyên nhân chính gây ra vấn đề hiệu năng...\n\n## Tại sao cần tối ưu?\n\nKhi một component cha render, tất cả component con cũng sẽ render theo mặc định...',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
  'frontend',
  ARRAY['React', 'Hooks', 'Web Performance'],
  true,
  false,
  'approved',
  (SELECT id FROM series WHERE slug = 'lam-chu-react-performance-2024' LIMIT 1),
  1,
  10,
  1250,
  45,
  12
),
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', -- REPLACEME
  'Virtualization: Xử lý danh sách 10,000 items siêu mượt',
  'virtualization-react-window',
  'Hướng dẫn sử dụng react-window để hiển thị hàng ngàn dữ liệu mà không làm lag trình duyệt.',
  '# Virtualization là gì?\n\nThay vì render tất cả cùng lúc, chúng ta chỉ render những gì người dùng đang thấy trên màn hình...',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
  'frontend',
  ARRAY['React', 'Optimization', 'List'],
  true,
  false,
  'approved',
  (SELECT id FROM series WHERE slug = 'lam-chu-react-performance-2024' LIMIT 1),
  2,
  15,
  890,
  38,
  5
);

-- 3. Insert a Featured Blog Post (Standalone)
INSERT INTO blog_posts (
  user_id,
  title,
  slug,
  excerpt,
  content,
  thumbnail_url,
  category,
  tags,
  is_published,
  is_featured,
  status,
  read_time_minutes,
  views_count,
  likes_count,
  comments_count
) VALUES (
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', -- REPLACEME
  'Roadmap trở thành Senior Frontend Developer 2024',
  'roadmap-senior-frontend-developer-2024',
  'Lộ trình chi tiết những kỹ năng bạn cần chuẩn bị để tiến tới vị trí Senior trong năm nay.',
  '# Lộ trình 2024\n\nTrở thành Senior không chỉ là biết code, mà là khả năng giải quyết vấn đề và tư duy hệ thống...',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
  'frontend',
  ARRAY['Career', 'Frontend', 'Roadmap'],
  true,
  true,
  'approved',
  12,
  5400,
  210,
  56
);

-- 4. Insert some Regular Blog Posts in other categories
INSERT INTO blog_posts (
  user_id,
  title,
  slug,
  excerpt,
  content,
  thumbnail_url,
  category,
  tags,
  is_published,
  is_featured,
  status,
  read_time_minutes,
  views_count,
  likes_count,
  comments_count
) VALUES 
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', -- REPLACEME
  'Xây dựng Microservices với Node.js và RabbitMQ',
  'microservices-nodejs-rabbitmq',
  'Cách triển khai kiến trúc microservices mạnh mẽ sử dụng message queue trong hệ sinh thái Node.js.',
  '# Microservices\n\nKiến trúc microservices giúp hệ thống scale tốt hơn và dễ bảo trì hơn...',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
  'backend',
  ARRAY['Node.js', 'Microservices', 'RabbitMQ'],
  true,
  false,
  'approved',
  20,
  3200,
  125,
  23
),
(
  'fd46fb38-569e-46ae-8cd2-0edd32c1ce87', -- REPLACEME
  'Sử dụng AI trong quy trình phát triển phần mềm hàng ngày',
  'ai-in-software-development',
  'Làm thế nào để tận dụng ChatGPT và Copilot để tăng 2x năng suất làm việc.',
  '# AI Replacement?\n\nKhông, AI là công cụ hỗ trợ chứ không thay thế hoàn toàn lập trình viên...',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
  'ai-ml',
  ARRAY['AI', 'ChatGPT', 'Productivity'],
  true,
  false,
  'approved',
  8,
  1500,
  89,
  14
);
