import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { usePost } from '@/hooks/usePosts';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/components/home/PostCard';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: post, isLoading, error } = usePost(id || '');

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-24 text-destructive">
                        <p className="text-xl font-semibold">Lỗi tải bài viết</p>
                        <p className="text-sm opacity-70">{(error as any).message}</p>
                    </div>
                ) : post ? (
                    <div className="space-y-6">
                        <PostCard post={post} />
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <p className="text-xl font-semibold">Không tìm thấy bài viết</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PostDetail;
