import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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
  };
  messages_count?: number;
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

// Helper function to fetch profile for a user
async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('id', userId)
    .single();
  return data;
}

export const useUserTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch products for each ticket
      const ticketsWithProducts = await Promise.all(
        (data || []).map(async (ticket) => {
          let product = null;
          if (ticket.product_id) {
            const { data: productData } = await supabase
              .from('products')
              .select('id, name')
              .eq('id', ticket.product_id)
              .single();
            product = productData;
          }
          return { ...ticket, product } as Ticket;
        })
      );

      return ticketsWithProducts;
    },
    enabled: !!user?.id,
  });
};

export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) throw error;

      let product = null;
      if (data.product_id) {
        const { data: productData } = await supabase
          .from('products')
          .select('id, name')
          .eq('id', data.product_id)
          .single();
        product = productData;
      }

      return { ...data, product } as Ticket;
    },
    enabled: !!ticketId,
  });
};

export const useTicketMessages = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket_messages', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithAuthors = await Promise.all(
        (data || []).map(async (message) => {
          const author = await fetchProfile(message.user_id);
          return { ...message, author } as TicketMessage;
        })
      );

      return messagesWithAuthors;
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

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject: input.subject,
          product_id: input.product_id,
          priority: input.priority || 'medium',
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Add initial message
      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          message: input.message,
        });

      if (messageError) throw messageError;

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Đã tạo ticket hỗ trợ!');
    },
    onError: (error) => {
      toast.error('Lỗi tạo ticket: ' + error.message);
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();

  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          message,
          is_staff_reply: isAdmin, // Set true if the sender is an admin
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket_messages', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      toast.success('Đã gửi tin nhắn!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};

export const useAdminTickets = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin_tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch products and authors for each ticket
      const enhancedTickets = await Promise.all(
        (data || []).map(async (ticket) => {
          let product = null;
          try {
            if (ticket.product_id) {
              const { data: productData } = await supabase
                .from('products')
                .select('id, name')
                .eq('id', ticket.product_id)
                .single();
              product = productData;
            }
          } catch (e) {
            console.error('Error fetching product for ticket:', e);
          }

          const author = await fetchProfile(ticket.user_id).catch(() => null);

          let messages_count = 0;
          try {
            const { count } = await supabase
              .from('ticket_messages')
              .select('*', { count: 'exact', head: true })
              .eq('ticket_id', ticket.id);
            messages_count = count || 0;
          } catch (e) {
            console.error('Error fetching message count for ticket:', e);
          }

          return { ...ticket, product, author, messages_count };
        })
      );

      return enhancedTickets;
    },
    enabled: isAdmin,
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: Ticket['status'] }) => {
      const { data, error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Không tìm thấy ticket hoặc bạn không có quyền cập nhật');
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', data.id] });
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
};
