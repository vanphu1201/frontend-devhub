import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

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
            const res = await api.stats.getUserStats();
            if (!res.success) {
                // Return defaults if not logged in
                return {
                    users_count: 0,
                    posts_count: 0,
                    products_count: 0,
                    downloads_count: 0
                } as PlatformStats;
            }

            const data = res.data as any;
            return {
                users_count: data.followersCount || 0,
                posts_count: data.postsCount || 0,
                products_count: data.productsCount || 0,
                downloads_count: data.reputation || 0
            } as PlatformStats;
        },
        staleTime: 1000 * 60 * 5,
    });
};
