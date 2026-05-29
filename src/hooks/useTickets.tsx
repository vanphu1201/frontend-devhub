import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Ticket {
  id: string;
  user_id: string;
  product_id: string | null;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
  } | null;
  messages_count?: number;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

const mapTicket = (t: any): Ticket => {
  return {
    id: t.id || t._id,
    user_id: t.user?.id || t.user || "",
    product_id: t.product?.id || t.product || null,
    subject: t.subject || "",
    status: t.status || 'open',
    priority: t.priority || 'medium',
    created_at: t.createdAt || new Date().toISOString(),
    updated_at: t.updatedAt || new Date().toISOString(),
    product: t.product ? {
      id: t.product.id || t.product._id || "",
      name: t.product.title || t.product.name || ""
    } : null,
    messages_count: t.messagesCount || 0,
    author: t.user ? {
      id: t.user.id || t.user._id || "",
      username: t.user.username || "",
      display_name: t.user.displayName || "",
      avatar_url: t.user.avatar || null
    } : null
  };
};

const mapTicketMessage = (m: any): TicketMessage => {
  return {
    id: m.id || m._id,
    ticket_id: m.ticket || "",
    user_id: m.sender?.id || m.sender || "",
    message: m.message || "",
    is_staff_reply: m.isStaffReply || false,
    created_at: m.createdAt || new Date().toISOString(),
    author: m.sender ? {
      id: m.sender.id || m.sender._id || "",
      username: m.sender.username || "",
      display_name: m.sender.displayName || "",
      avatar_url: m.sender.avatar || null
    } : undefined
  };
};

export const useUserTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const res = await api.ticket.getTickets();
      if (!res.success) throw new Error(res.error || "Failed to fetch user tickets");

      return (res.data || []).map(mapTicket);
    },
    enabled: !!user?.id,
  });
};

export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: async () => {
      const res = await api.ticket.getTicket(ticketId);
      if (!res.success) throw new Error(res.error || "Failed to fetch ticket");

      return mapTicket(res.data);
    },
    enabled: !!ticketId,
  });
};

export const useTicketMessages = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket_messages', ticketId],
    queryFn: async () => {
      const res = await api.ticket.getTicketMessages(ticketId);
      if (!res.success) throw new Error(res.error || "Failed to fetch ticket messages");

      return (res.data || []).map(mapTicketMessage);
    },
    enabled: !!ticketId,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      subject: string;
      message: string;
      product_id?: string;
      priority?: 'low' | 'medium' | 'high';
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.ticket.createTicket({
        subject: input.subject,
        message: input.message,
        productId: input.product_id || undefined,
        priority: input.priority || 'medium'
      });

      if (!res.success) throw new Error(res.error || "Failed to create ticket");
      return mapTicket(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Đã tạo ticket hỗ trợ!');
    },
    onError: (error: any) => {
      toast.error('Lỗi tạo ticket: ' + error.message);
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const res = await api.ticket.addTicketMessage(ticketId, message);
      if (!res.success) throw new Error(res.error || "Failed to add ticket message");

      return mapTicketMessage(res.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket_messages', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      toast.success('Đã gửi tin nhắn!');
    },
    onError: (error: any) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useAdminTickets = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin_tickets'],
    queryFn: async () => {
      const res = await api.ticket.getAdminTickets();
      if (!res.success) throw new Error(res.error || "Failed to fetch admin tickets");

      return (res.data || []).map(mapTicket);
    },
    enabled: isAdmin,
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: Ticket['status'] }) => {
      const res = await api.ticket.updateTicketStatus(ticketId, status === 'resolved' ? 'resolved' : status === 'closed' ? 'closed' : 'open');
      if (!res.success) throw new Error(res.error || "Failed to update ticket status");

      return mapTicket(res.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', data.id] });
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error: any) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};
