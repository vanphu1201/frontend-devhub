-- Populate Profile enhancements with realistic data
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- This script assumes you have at least one user. 
    -- It will update the first 3 users found in profiles with rich data.
    
    -- User 1: Frontend Expert
    SELECT id INTO target_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1 OFFSET 0;
    IF target_user_id IS NOT NULL THEN
        UPDATE public.profiles SET
            display_name = 'Nguyễn Văn A',
            username = 'vanya_frontend',
            bio = 'Chuyên gia Frontend với hơn 5 năm kinh nghiệm. Đam mê React, Next.js và thiết kế hệ thống giao diện tối giản.',
            location = 'Hà Nội, Việt Nam',
            website = 'https://vanya.dev',
            github_username = 'vanya-dev',
            twitter_username = 'vanya_codes',
            linkedin_username = 'vanya-nguyen',
            skills = ARRAY['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Figma'],
            reputation = 12500,
            followers_count = 450,
            following_count = 120
        WHERE id = target_user_id;
    END IF;

    -- User 2: Backend Architect
    SELECT id INTO target_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1 OFFSET 1;
    IF target_user_id IS NOT NULL THEN
        UPDATE public.profiles SET
            display_name = 'Trần Thị B',
            username = 'backend_queen',
            bio = 'KTS Hệ thống. Thích giải quyết các bài toán về hiệu suất, Microservices và cơ sở dữ liệu quy mô lớn.',
            location = 'TP. Hồ Chí Minh, Việt Nam',
            website = 'https://queen.io',
            github_username = 'b-queen',
            twitter_username = 'backend_tips',
            linkedin_username = 'thi-b-tran',
            skills = ARRAY['Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Go'],
            reputation = 8900,
            followers_count = 320,
            following_count = 85
        WHERE id = target_user_id;
    END IF;

    -- User 3: UI/UX Enthusiast
    SELECT id INTO target_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1 OFFSET 2;
    IF target_user_id IS NOT NULL THEN
        UPDATE public.profiles SET
            display_name = 'Lê Văn C',
            username = 'design_pro',
            bio = 'Nhà thiết kế sản phẩm tập trung vào sự kết nối giữa con người và công nghệ. Thích làm việc với Design Systems.',
            location = 'Đà Nẵng, Việt Nam',
            github_username = 'c-designer',
            skills = ARRAY['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'CSS'],
            reputation = 4200,
            followers_count = 180,
            following_count = 210
        WHERE id = target_user_id;
    END IF;
END $$;
