'use client'

import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {fontSans} from "@/lib/fonts";
import Navigation from "@/components/menu/navigation";

/**
 * Page shown to a user who's been sent a 404 HTTP response.
 * @group Next.js Pages
 */
export default function NotFoundPage() {
    return (
        <>
            <Navigation/>
            <div  className={cn("min-h-screen bg-background font-sans antialiased h-screen w-screen flex items-center", fontSans.variable)}>
                <div className="container flex flex-col md:flex-row items-center justify-center px-5">
                    <div className="max-w-md space-y-4">
                        <div className="text-5xl font-dark font-bold">404</div>
                        <p className={'text-muted-foreground'}>Sorry we couldn&apos;t find this page. </p>
                        <p className="mb-8 text-muted-foreground">But dont worry, you can find plenty of other things on our homepage.</p>
                        <Button
                            variant={'outline'}
                            onClick={() => {window.location.href = '/';}}
                        >back to homepage</Button>
                    </div>
                    <div className="max-w-lg">
                        <Image
                            src="/cat.svg"
                            alt="404"
                            width={500}
                            height={500}
                        />
                    </div>

                </div>
            </div>
        </>

    );
};
