import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    useBlogPostComments,
    useCreateBlogPostComment,
    useUploadBlogPostCommentImage,
    useLikeBlogPostComment,
    useUnlikeBlogPostComment,
    useIsBlogPostCommentLiked,
    BlogPost,
    BlogComment
} from '@/hooks/useBlogPosts';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Send, Image as ImageIcon, Smile, X, MessageSquare, Heart, Code, Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ContentRenderer from '@/components/ui/ContentRenderer';

interface BlogCommentDialogProps {
    post: BlogPost;
    isOpen: boolean;
    onClose: () => void;
}

const EMOJIS = ['❤️', '🔥', '👍', '🙏', '💯', '🚀', '💻', '✨', '👏', '😂', '😍', '🤔'];

const CommentItem: React.FC<{
    comment: BlogComment;
    postId: string;
    allComments: BlogComment[];
    onReply: (comment: BlogComment) => void;
    level?: number;
}> = ({ comment, postId, allComments, onReply, level = 0 }) => {
    const { user } = useAuth();
    const { data: isLiked } = useIsBlogPostCommentLiked(comment.id);
    const likeComment = useLikeBlogPostComment();
    const unlikeComment = useUnlikeBlogPostComment();

    const handleLike = () => {
        if (!user) return;
        if (isLiked) {
            unlikeComment.mutate({ commentId: comment.id, postId });
        } else {
            likeComment.mutate({ commentId: comment.id, postId });
        }
    };

    const replies = allComments.filter(c => c.parent_id === comment.id).sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const formatTime = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
        } catch (e) {
            return 'vừa xong';
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4 group">
                {comment.author?.avatar_url ? (
                    <img
                        src={comment.author.avatar_url}
                        alt="Avatar"
                        className="w-10 h-10 rounded-xl object-cover border-2 border-primary/10"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                        {comment.author?.display_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                )}
                <div className="flex-1">
                    <div className="bg-muted/40 rounded-2xl px-5 py-3 border border-border/50 group-hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm hover:text-primary cursor-pointer transition-colors">
                                {comment.author?.display_name || 'Người dùng'}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{formatTime(comment.created_at)}</span>
                        </div>
                        <ContentRenderer content={comment.content} />
                        {comment.image_url && (
                            <div className="mt-3 rounded-xl overflow-hidden border border-border shadow-sm">
                                <img src={comment.image_url} alt="Bình luận" className="max-w-full h-auto max-h-[300px] object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-6 mt-2 ml-2">
                        <button
                            onClick={handleLike}
                            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            {comment.likes_count > 0 && comment.likes_count} Thích
                        </button>
                        <button
                            onClick={() => onReply(comment)}
                            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Phản hồi
                        </button>
                    </div>
                </div>
            </div>

            {/* Render Replies */}
            {replies.length > 0 && (
                <div className="ml-14 mt-4 space-y-6 border-l-2 border-muted pl-4">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            allComments={allComments}
                            onReply={onReply}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const BlogCommentDialog: React.FC<BlogCommentDialogProps> = ({ post, isOpen, onClose }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<BlogComment | null>(null);

    const { data: comments, isLoading } = useBlogPostComments(post.id);
    const createComment = useCreateBlogPostComment();
    const uploadImage = useUploadBlogPostCommentImage();

    const topComments = (comments?.filter(c => (c.likes_count || 0) > 0) || [])
        .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
        .slice(0, 3);

    const rootComments = (comments?.filter(c => !c.parent_id) || []).sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const insertCodeSnippet = () => {
        setContent(prev => prev + '\n```\n\n```');
    };

    const insertEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
    };

    const handleSubmit = async () => {
        if (!user || (!content.trim() && !selectedImage)) return;

        try {
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadImage.mutateAsync(selectedImage);
            }

            createComment.mutate({
                postId: post.id,
                content: content,
                image_url: imageUrl,
                parent_id: replyingTo?.id
            }, {
                onSuccess: () => {
                    setContent('');
                    setSelectedImage(null);
                    setImagePreview(null);
                    setReplyingTo(null);
                }
            });
        } catch (err) {
            // Error handled by mutation
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1100px] h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-primary/20 shadow-2xl">
                <DialogHeader className="p-6 border-b border-border bg-background/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Thảo luận Blog</DialogTitle>
                            <p className="text-sm text-muted-foreground">Chia sẻ ý kiến của bạn về bài viết này</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-dots-grid">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="text-muted-foreground animate-pulse text-sm">Đang tải bình luận...</p>
                        </div>
                    ) : comments && comments.length > 0 ? (
                        <>
                            {/* Top Comments Section */}
                            {topComments.length > 0 && (
                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mb-8">
                                    <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-sm">
                                        <Trophy className="w-4 h-4" />
                                        Bình luận nổi bật
                                    </div>
                                    <div className="space-y-6">
                                        {topComments.map((comment) => (
                                            <div key={`top-${comment.id}`}>
                                                <CommentItem
                                                    comment={comment}
                                                    postId={post.id}
                                                    allComments={comments}
                                                    onReply={setReplyingTo}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Comments */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    Tất cả bình luận ({comments.length})
                                </div>
                                {rootComments.length > 0 ? (
                                    <div className="space-y-6">
                                        {rootComments.map((comment) => (
                                            <div key={comment.id}>
                                                <CommentItem
                                                    comment={comment}
                                                    postId={post.id}
                                                    allComments={comments}
                                                    onReply={setReplyingTo}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
                                        <p className="text-muted-foreground text-sm">Chưa có bình luận gốc nào.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-2">
                                <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-bold text-lg">Chưa có bình luận nào</h3>
                            <p className="text-muted-foreground max-w-[280px] text-sm">Hãy là người đầu tiên tham gia thảo luận về bài viết blog này!</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 border-t border-border bg-background flex-col gap-4">
                    {replyingTo && (
                        <div className="flex items-center justify-between px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-medium">Đang trả lời:</span>
                                <span className="text-primary font-bold">{replyingTo.author?.display_name || 'Người dùng'}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {imagePreview && (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 group animate-in zoom-in-95">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    <div className="w-full flex gap-4 items-end">
                        <div className="flex-1 bg-muted/30 rounded-2xl overflow-hidden border border-border focus-within:border-primary/50 focus-within:bg-card transition-all shadow-sm">
                            <Textarea
                                placeholder={user ? "Viết bình luận (hỗ trợ markdown & code)..." : "Đăng nhập để bình luận"}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={!user || createComment.isPending || uploadImage.isPending}
                                className="border-none focus-visible:ring-0 resize-none min-h-[56px] max-h-[160px] bg-transparent py-4 px-5 text-[15px] leading-relaxed"
                            />
                            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-muted/20">
                                <input
                                    type="file"
                                    id="comment-image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                    asChild
                                    title="Thêm ảnh"
                                >
                                    <label htmlFor="comment-image" className="cursor-pointer">
                                        <ImageIcon className="w-5 h-5" />
                                    </label>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                    onClick={insertCodeSnippet}
                                    title="Chèn code snippet"
                                >
                                    <Code className="w-5 h-5" />
                                </Button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                        >
                                            <Smile className="w-5 h-5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-3" align="start">
                                        <div className="grid grid-cols-6 gap-2">
                                            {EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => insertEmoji(emoji)}
                                                    className="h-9 w-9 flex items-center justify-center hover:bg-primary/10 hover:text-primary rounded-xl text-xl transition-all"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <div className="flex-1" />
                                <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground py-0 h-5 bg-muted/50 border-none">
                                    #markdown_ready
                                </Badge>
                            </div>
                        </div>
                        <Button
                            size="icon"
                            className="rounded-2xl h-14 w-14 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0 bg-primary"
                            disabled={!user || (!content.trim() && !selectedImage) || createComment.isPending || uploadImage.isPending}
                            onClick={handleSubmit}
                        >
                            {(createComment.isPending || uploadImage.isPending) ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <Send className="w-6 h-6 ml-0.5" />
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BlogCommentDialog;
