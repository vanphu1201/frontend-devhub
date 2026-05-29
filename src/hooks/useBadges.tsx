import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Badge {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    type: string | null;
    points_required: number | null;
    created_at: string | null;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    awarded_at: string;
    badge?: Badge;
}

export const useUserBadges = (userId: string) => {
    return useQuery({
        queryKey: ['user_badges', userId],
        queryFn: async () => {
            const res = await api.badge.getUserBadges(userId);
            if (!res.success) throw new Error(res.error || "Failed to fetch user badges");

            return (res.data || []).map((ub: any) => ({
                id: ub.id,
                user_id: userId,
                badge_id: ub.badge?.id || "",
                awarded_at: ub.awardedAt || new Date().toISOString(),
                badge: ub.badge ? {
                    id: ub.badge.id,
                    name: ub.badge.name,
                    icon: ub.badge.icon,
                    description: ub.badge.description,
                    type: null,
                    points_required: null,
                    created_at: null
                } : undefined
            })) as UserBadge[];
        },
        enabled: !!userId,
    });
};

export const useAllBadges = () => {
    return useQuery({
        queryKey: ['badges'],
        queryFn: async () => {
            // Emulate or return empty array if all badges list endpoint is not registered
            return [] as Badge[];
        },
    });
};
