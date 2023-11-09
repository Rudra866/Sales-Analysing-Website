import {cn} from "@/lib/utils";
import {fontSans} from "@/lib/fonts";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import React from "react";

/**
 * Page shown to a user who's been sent a 401 HTTP response.
 * @group Next.js Pages
 */
export default function UnauthorizedPage() {
    // add shadcn layout
    return (
        <div  className={cn("min-h-screen bg-background font-sans antialiased h-screen w-screen flex items-center", fontSans.variable)}>
            <div className="container flex flex-col md:flex-row items-center justify-center px-5">
                <div className="max-w-md space-y-4">
                    <div className="text-5xl font-dark font-bold">401 Unauthorized Access</div>
                    <p className={'text-muted-foreground'}>You are not authorized to access this page</p>
                    <Button variant={'outline'}>back to homepage</Button>
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
    );
};
