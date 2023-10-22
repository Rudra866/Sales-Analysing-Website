import { Button } from "@/registry/new-york/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/registry/new-york/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { CalendarDateRangePicker } from "@/components/dashboard-components/date-range-picker"
import { Overview } from "@/components/dashboard-components/overview"
import { RecentSales } from "@/components/dashboard-components/recent-sales"
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";


// Todo dashboard charts
//



export default async function DashboardPage() {
    // if !session redirect to /authentication
    // add role based access control
    // home page will be different for each role

    const supabase = createServerComponentClient({ cookies })

    const {data: {session},} = await supabase.auth.getSession();

    if (!session) {
        redirect('/authentication')
    } else {
        redirect('/dashboard')
    }


    return (
        <>
            <div className="md:hidden">

            </div>
        </>
    )
}
