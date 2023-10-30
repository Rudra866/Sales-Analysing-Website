import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

/**
 * The root page of the app. Redirects to `/dashboard`
 * @group Next.js Pages
 * @route `/`
 */
export default async function RootPage() {

    // TODO https://youtu.be/KmJN-bEayeY?si=IvDmsmw_xtZHiz1Y

    redirect('/dashboard')
    return (
        <>
            <div className="md:hidden">
                Old Dashboard
            </div>
        </>
    )
}
