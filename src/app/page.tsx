import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function DashboardPage() {

    // TODO https://youtu.be/KmJN-bEayeY?si=IvDmsmw_xtZHiz1Y

    const cookiesStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookiesStore })

    const {data: {session},} = await supabase.auth.getSession();

    if (!session) {
      redirect('/authentication')
    }
    return (
        <>
            <div className="md:hidden">
                Old Dashboard
            </div>
        </>
    )
}
