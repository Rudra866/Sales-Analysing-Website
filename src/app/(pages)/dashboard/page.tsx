'use client'

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {CalendarDateRangePicker} from "./components/date-range-picker"
import {Overview} from "./components/overview"
import {RecentSales} from "./components/recent-sales"
import {useEffect, useState} from "react";
import * as React from "react";
import {format} from "date-fns";
import {CreditCard, DollarSign} from "lucide-react";
import {Icons} from "@/components/icons";
import {cn} from "@/lib/utils";
import {useDashboard} from "./components/dashboard-provider";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {DbResult} from "@/lib/types";
import useAuth from "@/hooks/use-auth";
import {getAllNotifications, MonthlySale, Sale, SalesGoal} from "@/lib/database";
import {DynamicChart} from "@/components/dynamic-chart";
import SalesLineChart from "@/components/sales-line-chart";
import SummaryCard, {CountCard} from "./components/summary-card";


// TODO maybe we can split this page to some public components? We can also add db method to handle this db request.
/**
 * Main dashboard page for the app.
 * @group Next.js Pages
 * @route `/dashboard`
 */
export default function DashboardPage() {
    const supabase = getSupabaseBrowserClient();
    const {data, date, setDate} = useDashboard()
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [grossProfit, setGrossProfit] = useState<number>(0);
    // const [monthlySales, setMonthlySales] = useState<MonthlySale[]>();
    const {employee} = useAuth();

    useEffect(() => {
        setTotalRevenue(data
            ?.map((sale) => sale?.Total)
            .reduce((a, b) => a + b, 0) ?? 0)

        setGrossProfit(data
            ?.map((sale) => sale?.GrossProfit)
            .reduce((a, b) => a + b, 0) ?? 0)

    }, [data, date, supabase]);


    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker date={date} setDate={setDate}/>
                            <Button>Download</Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard defaultCategory={'Total'} />
                        <SummaryCard defaultCategory={'GrossProfit'} />
                        <SummaryCard defaultCategory={'DealerCost'} />
                        {/*todo sales forecast with actual sales*/}
                        <CountCard />
                    {/*todo    Forecasted Sale ? */}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Sales</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview/>
                            </CardContent>
                        </Card>
                        <RecentSales/>
                        <SalesLineChart data={data as Sale[]} date={date}/>
                        <DynamicChart
                            className="col-span-3"
                            data={data!}
                            date={date}
                            title={'Sales'}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
