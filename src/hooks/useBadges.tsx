import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
            const { data, error } = await supabase
                .from('user_badges')
                .select(`
          *,
          badge:badges(*)
        `)
                .eq('user_id', userId);

            if (error) throw error;
            return data as UserBadge[];
        },
        enabled: !!userId,
    });
};

export const useAllBadges = () => {
    return useQuery({
        queryKey: ['badges'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('badges')
                .select('*')
                .order('name');

            if (error) throw error;
            return data as Badge[];
        },
    });
};
