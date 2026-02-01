import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit, AlertCircle } from 'lucide-react';
import { useDeletePost, Post } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PostMenuProps {
    post: Post;
}

const PostMenu: React.FC<PostMenuProps> = ({ post }) => {
    const { user } = useAuth();
    const deletePost = useDeletePost();

    const isOwner = user?.id === post.user_id;

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            deletePost.mutate(post.id);
        }
    };

    const handleEdit = () => {
        toast.info('Tính năng chỉnh sửa đang được phát triển');
    };

    const handleReport = () => {
        toast.success('Đã gửi báo cáo bài viết. Cảm ơn bạn!');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-xl border-border">
                {isOwner ? (
                    <>
                        <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer text-sm font-medium" onClick={handleEdit}>
                            <Edit className="w-4 h-4 text-muted-foreground" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 py-2.5 cursor-pointer text-destructive focus:text-destructive text-sm font-medium"
                            onClick={handleDelete}
                            disabled={deletePost.isPending}
                        >
                            <Trash className="w-4 h-4" />
                            {deletePost.isPending ? 'Đang xóa...' : 'Xóa bài viết'}
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem className="gap-2 py-2.5 cursor-pointer text-sm font-medium" onClick={handleReport}>
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        Báo cáo vi phạm
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PostMenu;
