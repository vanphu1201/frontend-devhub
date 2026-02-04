import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    MessageSquare,
    Share2,
    Bookmark,
    Eye,
    Trophy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
    useLikePost,
    useUnlikePost,
    useIsPostLiked,
    useBookmarkPost,
    useIsPostBookmarked,
    useSharePost,
    usePostComments,
    Post
} from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import CommentDialog from '@/components/home/CommentDialog';
import PostMenu from '@/components/home/PostMenu';
import ContentRenderer from '@/components/ui/ContentRenderer';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const { user } = useAuth();
    const { data: isLiked } = useIsPostLiked(post.id);
    const { data: isBookmarked } = useIsPostBookmarked(post.id);
    const likePost = useLikePost();
    const unlikePost = useUnlikePost();
    const bookmarkPost = useBookmarkPost();
    const sharePost = useSharePost();
    const [isCommentOpen, setIsCommentOpen] = useState(false);

    const handleLike = () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để like bài viết');
            return;
        }
        if (isLiked) {
            unlikePost.mutate(post.id);
        } else {
            likePost.mutate(post.id);
        }
    };

    const handleBookmark = () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để lưu bài viết');
            return;
        }
        bookmarkPost.mutate(post.id);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/post/${post.id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'CodeConnect Hub',
                    text: post.content.substring(0, 100) + '...',
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success('Đã sao chép liên kết vào bộ nhớ tạm!');
            }
            sharePost.mutate(post.id);
        } catch (err) {
            // User cancelled
        }
    };

    const getInitial = () => {
        if (post.author?.display_name) return post.author.display_name[0].toUpperCase();
        if (post.author?.username) return post.author.username[0].toUpperCase();
        return 'U';
    };

    const getAuthorName = () => {
        return post.author?.display_name || post.author?.username || 'Người dùng';
    };

    const getUsername = () => {
        return post.author?.username ? `@${post.author.username}` : '';
    };

    const { data: comments } = usePostComments(post.id);

    const topComments = (comments || [])
        .filter(c => (c.likes_count || 0) > 0)
        .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
        .slice(0, 3);

    const formatTime = (dateStr: string) => {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi });
    };

    return (
        <article className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {post.author?.avatar_url ? (
                            <img
                                src={post.author.avatar_url}
                                alt={getAuthorName()}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-inner">
                                {getInitial()}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <Link to={`/profile/${post.user_id}`} className="font-semibold hover:text-primary transition-colors">
                                    {getAuthorName()}
                                </Link>
                                {post.author?.reputation && post.author.reputation > 1000 && (
                                    <Badge variant="gold" className="text-[10px] h-5">
                                        ⭐ {(post.author.reputation / 1000).toFixed(1)}K RP
                                    </Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{getUsername()}</span>
                                {getUsername() && <span>•</span>}
                                <span>{formatTime(post.created_at)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {post.views_count?.toLocaleString() || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                    <PostMenu post={post} />
                </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
                <ContentRenderer content={post.content} />

                {/* Post Image (Fallback - at bottom) */}
                {post.image_url && !post.content.includes(post.image_url) && (
                    <div className={`mt-6 ${post.image_size === 'small' ? 'max-w-[300px]' :
                        post.image_size === 'medium' ? 'max-w-[500px]' :
                            'w-full'
                        }`}>
                        <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                            <img
                                src={post.image_url}
                                alt="Post content"
                                className="w-full h-auto object-cover max-h-[600px] hover:scale-[1.01] transition-transform duration-500"
                            />
                        </div>
                    </div>
                )}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="tech">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Top Comments Preview */}
                {topComments.length > 0 && (
                    <div className="mt-4 bg-muted/20 border border-border/50 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-primary/70 uppercase tracking-wider">
                            <Trophy className="w-3 h-3" />
                            Bình luận hàng đầu
                        </div>
                        <div className="space-y-4">
                            {topComments.map((comment, index) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold border border-primary/10">
                                        {comment.author?.display_name?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-bold truncate">
                                                {comment.author?.display_name || 'Người dùng'}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                • {formatTime(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                                            "{comment.content}"
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-primary">
                                            <Heart className="w-3 h-3 fill-current" />
                                            {comment.likes_count} lượt thích
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Button
                        variant={isLiked ? "gradient" : "ghost"}
                        size="sm"
                        className={`gap-2 rounded-xl transition-all duration-300 ${isLiked ? 'shadow-md shadow-primary/20' : 'hover:text-primary hover:bg-primary/10'}`}
                        onClick={handleLike}
                        disabled={likePost.isPending || unlikePost.isPending}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
                        <span className="font-bold">{post.likes_count || 0}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 rounded-xl hover:text-primary hover:bg-primary/10"
                        onClick={(e) => { e.stopPropagation(); setIsCommentOpen(true); }}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-bold">{post.comments_count || 0}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 rounded-xl hover:text-primary hover:bg-primary/10"
                        onClick={handleShare}
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="font-bold">{post.shares_count || 0}</span>
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-xl transition-all ${isBookmarked ? 'text-primary bg-primary/10' : 'hover:text-primary hover:bg-primary/10'}`}
                    onClick={handleBookmark}
                >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
            </div>

            <CommentDialog
                post={post}
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
            />
        </article>
    );
};

export default PostCard;
