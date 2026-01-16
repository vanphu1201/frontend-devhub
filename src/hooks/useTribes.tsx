import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Tribe {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar: string | null;
  cover_image: string | null;
  tags: string[];
  members_count: number;
  posts_count: number;
  is_private: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TribeMember {
  id: string;
  tribe_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useTribes = () => {
  return useQuery({
    queryKey: ['tribes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tribes')
        .select('*')
        .order('members_count', { ascending: false });

      if (error) throw error;
      return data as Tribe[];
    },
  });
};

export const useFeaturedTribes = () => {
  return useQuery({
    queryKey: ['tribes', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tribes')
        .select('*')
        .order('members_count', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data as Tribe[];
    },
  });
};

export const useTribe = (tribeId: string) => {
  return useQuery({
    queryKey: ['tribes', tribeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tribes')
        .select('*')
        .eq('id', tribeId)
        .single();

      if (error) throw error;
      return data as Tribe;
    },
    enabled: !!tribeId,
  });
};

export const useUserTribes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tribes', 'user', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: memberships, error } = await supabase
        .from('tribe_members')
        .select('tribe_id, role')
        .eq('user_id', user.id);

      if (error) throw error;
      if (!memberships || memberships.length === 0) return [];

      // Fetch tribes for each membership
      const { data: tribes, error: tribesError } = await supabase
        .from('tribes')
        .select('*')
        .in('id', memberships.map(m => m.tribe_id));

      if (tribesError) throw tribesError;

      return (tribes || []).map(tribe => ({
        ...tribe,
        role: memberships.find(m => m.tribe_id === tribe.id)?.role || 'member',
      })) as (Tribe & { role: string })[];
    },
    enabled: !!user?.id,
  });
};

export const useIsTribeMember = (tribeId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tribe_members', tribeId, user?.id],
    queryFn: async () => {
      if (!user?.id) return { isMember: false, role: null };

      const { data, error } = await supabase
        .from('tribe_members')
        .select('id, role')
        .eq('tribe_id', tribeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data ? { isMember: true, role: data.role } : { isMember: false, role: null };
    },
    enabled: !!user?.id && !!tribeId,
  });
};

export const useJoinTribe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tribeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tribe_members')
        .insert({ tribe_id: tribeId, user_id: user.id, role: 'member' });

      if (error) throw error;

      // Update members_count
      const { data: tribe } = await supabase
        .from('tribes')
        .select('members_count')
        .eq('id', tribeId)
        .single();

      if (tribe) {
        await supabase
          .from('tribes')
          .update({ members_count: (tribe.members_count || 0) + 1 })
          .eq('id', tribeId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribes'] });
      queryClient.invalidateQueries({ queryKey: ['tribe_members'] });
      toast.success('Đã tham gia tribe!');
    },
    onError: (error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Bạn đã là thành viên của tribe này!');
      } else {
        toast.error('Lỗi: ' + error.message);
      }
    },
  });
};

export const useLeaveTribe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tribeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tribe_members')
        .delete()
        .eq('tribe_id', tribeId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update members_count
      const { data: tribe } = await supabase
        .from('tribes')
        .select('members_count')
        .eq('id', tribeId)
        .single();

      if (tribe && tribe.members_count > 0) {
        await supabase
          .from('tribes')
          .update({ members_count: tribe.members_count - 1 })
          .eq('id', tribeId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribes'] });
      queryClient.invalidateQueries({ queryKey: ['tribe_members'] });
      toast.success('Đã rời khỏi tribe!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useCreateTribe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { name: string; description: string; is_private: boolean; tags: string[] }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { data: tribe, error } = await supabase
        .from('tribes')
        .insert({
          name: data.name,
          slug,
          description: data.description,
          is_private: data.is_private,
          tags: data.tags,
          created_by: user.id,
          members_count: 1,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join as admin
      await supabase
        .from('tribe_members')
        .insert({ tribe_id: tribe.id, user_id: user.id, role: 'admin' });

      return tribe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribes'] });
      toast.success('Đã tạo tribe mới!');
    },
    onError: (error) => {
      toast.error('Lỗi tạo tribe: ' + error.message);
    },
  });
};
