import {redirect} from "next/navigation";

/**
 * The root page of the app. Redirects to `/dashboard`
 * @group Next.js Pages
 * @route `/`
 */
export default async function RootPage() {
    redirect('/dashboard')
    return (
        <>
            <div className="md:hidden">
                Old Dashboard
            </div>
        </>
    )
}
