import { Skeleton } from "@/components/ui/skeleton";

export const PostCardSkeleton = () => (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
    </div>
);

export const ProductCardSkeleton = () => (
    <div className="bg-card rounded-2xl border border-border overflow-hidden h-full">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    </div>
);

export const ResourceCardSkeleton = () => (
    <div className="bg-card rounded-xl border border-border p-4 flex gap-4">
        <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    </div>
);

export const UserRowSkeleton = () => (
    <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
        </div>
        <div className="text-right space-y-2">
            <Skeleton className="h-5 w-16 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
        </div>
    </div>
);

export const BadgeSkeleton = () => (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center space-y-3">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-3 w-24" />
    </div>
);
