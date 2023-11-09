'use client'

import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
// import {CalendarDateRangePicker} from "./components/date-range-picker"
import {useDashboard} from "./components/dashboard-provider";
import useAuth from "@/hooks/use-auth";
// import Dashboard from "@/app/(pages)/dashboard/components/Dashboard";
import dynamic from "next/dynamic";
import Loading from "@/app/(pages)/dashboard/loading";
// import DashboardSalesTable from "@/app/(pages)/dashboard/components/DashboardSalesTable";
// import DashboardHeader from "@/app/(pages)/dashboard/components/DashboardHeader";

const Dashboard =
    dynamic(() => import('./components/Dashboard'), {loading: () => <Loading />})

const DashboardSalesTable =
    dynamic(() => import('./components/DashboardSalesTable'), {loading: () => <Loading />})

const DashboardHeader =
    dynamic(() => import('./components/DashboardHeader'), {loading: () => <Loading />})



// TODO maybe we can split this page to some public components? We can also add db method to handle this db request.
/**
 * Main dashboard page for the app.
 * @group Next.js Pages
 * @route `/dashboard`
 */
export default function DashboardPage() {
    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <DashboardHeader/>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="Sales Table">Sales Table</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <Dashboard/>
                        </TabsContent>
                        <TabsContent value="Sales Table">
                            <DashboardSalesTable/>
                        </TabsContent>
                        <TabsContent value="reports">
                            Reports
                        </TabsContent>
                        <TabsContent value="notifications">
                            Notifications
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
