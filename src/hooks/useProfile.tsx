import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github_username: string | null;
  twitter_username: string | null;
  linkedin_username: string | null;
  skills: string[];
  reputation: number;
  consumption_points: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

const mapProfile = (p: any): Profile => {
  return {
    id: p.id || p._id,
    username: p.username || null,
    display_name: p.displayName || null,
    avatar_url: p.avatar || null,
    cover_url: p.coverImage || null,
    bio: p.bio || null,
    location: p.location || null,
    website: p.website || null,
    github_username: p.githubUsername || null,
    twitter_username: p.twitterUsername || null,
    linkedin_username: p.linkedinUsername || null,
    skills: p.skills || [],
    reputation: p.reputation || 0,
    consumption_points: p.consumptionPoints || 0,
    followers_count: p.followers?.length || 0,
    following_count: p.following?.length || 0,
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: p.updatedAt || new Date().toISOString(),
  };
};

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      const res = await api.user.getProfile(targetUserId);
      if (!res.success) throw new Error(res.error || "Failed to fetch profile");

      return mapProfile(res.data);
    },
    enabled: !!targetUserId,
  });
};

export const useProfileByUsername = (username: string) => {
  return useQuery({
    queryKey: ['profile', 'username', username],
    queryFn: async () => {
      const res = await api.user.getProfileByUsername(username);
      if (!res.success) throw new Error(res.error || "Failed to fetch profile by username");

      return mapProfile(res.data);
    },
    enabled: !!username,
  });
};

export const useLeaderboard = (limit = 10) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const res = await api.user.getLeaderboard(limit, 0);
      if (!res.success) throw new Error(res.error || "Failed to fetch leaderboard");

      return (res.data || []).map(mapProfile);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.user.updateProfile({
        displayName: updates.display_name,
        username: updates.username || undefined,
        bio: updates.bio || undefined,
        skills: updates.skills
      });

      if (!res.success) throw new Error(res.error || "Failed to update profile");
      return mapProfile(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: any) => {
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

      const res = await api.user.followUser(followingId);
      if (!res.success) throw new Error(res.error || "Failed to follow user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      toast.success('Đã theo dõi!');
    },
    onError: (error: any) => {
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

      const res = await api.user.unfollowUser(followingId);
      if (!res.success) throw new Error(res.error || "Failed to unfollow user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      toast.success('Đã hủy theo dõi!');
    },
    onError: (error: any) => {
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

      const res = await api.user.isFollowing(targetUserId);
      if (!res.success) return false;

      return !!res.data?.isFollowing;
    },
    enabled: !!user?.id && !!targetUserId && user.id !== targetUserId,
  });
};

export const useUploadAvatar = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.user.uploadAvatar(file);
      if (!res.success) throw new Error(res.error || "Failed to upload avatar");

      return res.data?.avatarUrl || res.data;
    },
    onError: (error: any) => {
      toast.error('Lỗi tải ảnh đại diện: ' + error.message);
    },
  });
};

export const useUploadCover = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.user.uploadCover(file);
      if (!res.success) throw new Error(res.error || "Failed to upload cover image");

      return res.data?.coverUrl || res.data;
    },
    onError: (error: any) => {
      toast.error('Lỗi tải ảnh bìa: ' + error.message);
    },
  });
};
