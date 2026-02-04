import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface PlatformStats {
    users_count: number;
    posts_count: number;
    products_count: number;
    downloads_count: number;
}

export const usePlatformStats = () => {
    return useQuery({
        queryKey: ['platform-stats'],
        queryFn: async () => {
            // Fetch counts from different tables
            // Note: count: 'exact' or 'estimated'

            const [
                { count: profilesCount },
                { count: postsCount },
                { count: productsCount },
                { data: productDownloads },
                { data: resourceDownloads }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('downloads_count'),
                supabase.from('resources').select('downloads_count')
            ]);

            const totalProductDownloads = (productDownloads || []).reduce((acc, p) => acc + (p.downloads_count || 0), 0);
            const totalResourceDownloads = (resourceDownloads || []).reduce((acc, r) => acc + (r.downloads_count || 0), 0);

            return {
                users_count: profilesCount || 0,
                posts_count: postsCount || 0,
                products_count: productsCount || 0,
                downloads_count: totalProductDownloads + totalResourceDownloads
            } as PlatformStats;
        },
        // Keep data fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
    });
};
