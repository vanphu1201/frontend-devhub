import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github_username: string | null;
  twitter_username: string | null;
  linkedin_username: string | null;
  skills: string[];
  reputation: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!targetUserId,
  });
};

export const useProfileByUsername = (username: string) => {
  return useQuery({
    queryKey: ['profile', 'username', username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!username,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (followingId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: followingId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      toast.success('Đã theo dõi!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (followingId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      toast.success('Đã hủy theo dõi!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useIsFollowing = (targetUserId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['follows', 'isFollowing', user?.id, targetUserId],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && !!targetUserId && user.id !== targetUserId,
  });
};
