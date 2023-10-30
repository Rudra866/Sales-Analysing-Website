import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

// todo loading skeleton & spinner,

/**
 * React component to display while the page is loading.
 * @group React Components
 */
export default function Loading() {
    return (
        <div className="hidden flex-col md:flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <Skeleton className="h-12 w-48" />  {/* Dashboard Title */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10" />  {/* Calendar Icon */}
                        <Skeleton className="h-10 w-32" />  {/* Download Button */}
                    </div>
                </div>
                <Skeleton className="h-12 w-full mb-4" />  {/* Tabs */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Card Skeletons */}
                    {Array(4).map((_, index) => (
                        <div key={index} className="skeleton-card">
                            <Skeleton className="h-10 w-full mb-2" />  {/* Card Header */}
                            <Skeleton className="h-20 w-full" />  {/* Card Content */}
                        </div>
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        <Skeleton className="h-10 w-full mb-2" />  {/* Card Header */}
                        <Skeleton className="h-60 w-full" />  {/* Card Content */}
                    </div>
                    <div className="col-span-3">
                        <Skeleton className="h-10 w-full mb-2" />  {/* Card Header */}
                        <Skeleton className="h-60 w-full" />  {/* Card Content */}
                    </div>
                </div>
                <Skeleton className="h-12 w-full mb-4" />  {/* Tabs Content Skeleton */}
            </div>
        </div>
    );
}
