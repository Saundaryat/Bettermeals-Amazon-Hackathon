import React from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    imageSrc?: string;
}

export default function AuthLayout({ children, title, subtitle, imageSrc }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex lg:h-screen lg:overflow-hidden">
            {/* Left Side - Branding/Image */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 p-6 items-center justify-center">
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src="/app/images/login_page_bm-optimized.webp"
                        srcSet="/app/images/login_page_bm-small.webp 640w,
                                /app/images/login_page_bm-medium.webp 1024w,
                                /app/images/login_page_bm-optimized.webp 1920w"
                        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
                        alt="Authentication Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                    />
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col items-center pt-4 sm:pt-8 lg:pt-12 px-4 sm:px-8 pb-6 bg-white lg:overflow-y-auto overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex flex-col items-center mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <img
                                src="/app/images/icon2.png"
                                alt="Logo"
                                className="w-8 h-8 sm:w-10 sm:h-10"
                            />
                            <span className="text-xl sm:text-2xl font-bold text-[#51754f]">bettermeals</span>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
