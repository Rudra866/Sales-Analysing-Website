'use client'
import React, {useEffect, useState} from 'react';
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

function Page() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(false)
    }, []);

    return (
        <div className={cn('bg-background text-primary-foreground hover:text-primary cursor-pointer',
            pathname == '/inventory' ? 'text-indigo-500' : 'text-yellow-400')}>
            {open && <div className="flex items-center justify-between font-black text-lg">Modal</div>}
        </div>
    );
}


export default Page;
