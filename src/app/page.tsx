'use client'

import {redirect} from "next/navigation";
import useAuth from "@/hooks/use-auth";
import {isAdmin} from "@/lib/utils";

/**
 * The root page of the app. Redirects to `/dashboard`
 * @group Next.js Pages
 * @route `/`
 */
export default function RootPage() {
    const {role} = useAuth()
    if (role && isAdmin(role.id)) redirect('/admin/dashboard')
    else redirect('/employee')

    return (
        <>
            <div className="md:hidden">
                Old Dashboard
            </div>
        </>
    )
}


//todo mobile responsiveness , data provider
