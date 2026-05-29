import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'pdf' | 'code' | 'image' | 'video';
  category: string | null;
  file_url: string | null;
  file_size: string | null;
  is_premium: boolean;
  price: number;
  points_price: number;
  downloads_count: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface ResourcePurchase {
  id: string;
  user_id: string;
  resource_id: string;
  unlocked_at: string;
}

const mapResource = (r: any): Resource => {
  return {
    id: r.id || r._id,
    user_id: r.author?.id || r.author || "",
    title: r.title,
    description: r.description || null,
    type: r.type,
    category: null,
    file_url: r.fileUrl || null,
    file_size: null,
    is_premium: r.isPremium || false,
    price: 0,
    points_price: 0,
    downloads_count: r.downloads || 0,
    rating: r.rating || 0,
    reviews_count: 0,
    created_at: r.createdAt || new Date().toISOString(),
    updated_at: r.updatedAt || new Date().toISOString(),
    author: r.author ? {
      id: r.author.id || r.author._id || "",
      username: r.author.username || "",
      display_name: r.author.displayName || "",
      avatar_url: r.author.avatar || null
    } : undefined
  };
};

export const useResources = (filter: 'all' | 'free' | 'premium' = 'all') => {
  return useQuery({
    queryKey: ['resources', filter],
    queryFn: async () => {
      const isPremiumParam = filter === 'free' ? 'false' : filter === 'premium' ? 'true' : undefined;
      const res = await api.resource.getResources(filter, 50, 0);
      if (!res.success) throw new Error(res.error || "Failed to fetch resources");

      return (res.data?.items || []).map(mapResource);
    },
  });
};

export const useAdminResources = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['resources', 'admin'],
    queryFn: async () => {
      const res = await api.resource.getAdminResources();
      if (!res.success) throw new Error(res.error || "Failed to fetch admin resources");

      return (res.data?.items || []).map(mapResource);
    },
    enabled: isAdmin,
  });
};

export const useResource = (resourceId: string) => {
  return useQuery({
    queryKey: ['resources', resourceId],
    queryFn: async () => {
      const res = await api.resource.getResource(resourceId);
      if (!res.success) throw new Error(res.error || "Failed to fetch resource");

      return mapResource(res.data);
    },
    enabled: !!resourceId,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: Partial<Resource>) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Mimic file upload or mock URL
      const dummyFile = new File(["dummy"], "dummy.pdf", { type: "application/pdf" });
      const res = await api.resource.createResource(dummyFile, {
        title: input.title!,
        type: input.type || 'pdf',
        description: input.description || "",
        isPremium: input.is_premium || false
      });

      if (!res.success) throw new Error(res.error || "Failed to create resource");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Tạo tài liệu thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Resource> & { id: string }) => {
      const res = await api.resource.updateResource(id, {
        title: updates.title,
        description: updates.description || undefined,
        isPremium: updates.is_premium
      });

      if (!res.success) throw new Error(res.error || "Failed to update resource");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources', data?.id] });
      toast.success('Cập nhật thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const res = await api.resource.deleteResource(resourceId);
      if (!res.success) throw new Error(res.error || "Failed to delete resource");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Đã xóa tài liệu!');
    },
    onError: (error: any) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useUserResourcePurchases = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['resource_purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await api.resource.getUserResourcePurchases();
      if (!res.success) throw new Error(res.error || "Failed to fetch user resource purchases");

      return (res.data?.items || []).map((u: any) => ({
        id: u.id,
        user_id: user.id,
        resource_id: u.resource?.id || "",
        unlocked_at: u.unlockedAt
      })) as ResourcePurchase[];
    },
    enabled: !!user?.id,
  });
};

export const useUnlockResource = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (resourceId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.resource.unlockResource(resourceId);
      if (!res.success) throw new Error(res.error || "Failed to unlock resource");

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource_purchases', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Đã mở khóa tài liệu thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};
