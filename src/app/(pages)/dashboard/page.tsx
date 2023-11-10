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

// placeholder data
const placeholderData = [
    {
        date: "Sep-23",
        actual: 4000,
        estimate: 2400,
    },
    {
        date: "Aug-23",
        actual: 3000,
        estimate: 1398,
    },
    {
        date: "Jul-23",
        actual: 2000,
        estimate: 9800,
    },
    {
        date: "Jun-23",
        actual: 2780,
        estimate: 3908,
    },
    {
        date: "May-23",
        actual: 1890,
        estimate: 4800,

    },
    {
        date: "Apr-23",
        actual: 2390,
        estimate: 3800,
    },
    {
        date: "Mar-23",
        actual: 3490,
        estimate: 4300,
    }
];


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
    // const [monthlySales, setMonthlySales] = useState<MonthlySale[]>();
    const { employee} = useAuth();


    // temp -- ryan
    const [notifications, setNotifications] = useState<Notification[] | null>(null)
    type SalesGoalFragment = {
        TotalGoal: number;
        EndDate: string;
    }

    useEffect(() => {
        try {
            const getNotifications = async () => {
                // @ts-ignore
                setNotifications(await getAllNotifications(supabase));
            }
            getNotifications();
        } catch (error) {console.error(error)}
    }, [supabase]);


    useEffect(() => {
        setTotalRevenue(data
            ?.map((sale) => sale?.Total)
            .reduce((a, b) => a + b, 0) ?? 0)
    }, [data, date, supabase]);



    // todo do we even need monthly sales??
    // useEffect(() => {
    //     const fetchTable = async () => {
    //         let {data: monthly_sales, error} = await supabase
    //             .from('MonthlySales')
    //             .select('*');
    //
    //         const month = format(new Date(), 'yyyy-MMM');
    //         const ms = monthly_sales?.filter((sale) => format(
    //             new Date(sale?.TimePeriod || new Date())
    //             , 'yyyy-MMM') === month)?.map((sale) => sale?.Total)?.reduce((a, b) => a + b, 0) || 0
    //
    //         setMonthlySales(ms as DbResult<typeof ms[]>);
    //     };
    //
    //     fetchTable();
    //
    // }, [])


    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker date={date} setDate={setDate}/>
                            <Button>Download</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="Sales Table">Sales Table</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        {/*todo  total revenue for the month - total estimated sales*/}
                                        <CardTitle className="text-sm font-medium">Total Revenue for the
                                            month</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{`$${totalRevenue.toLocaleString()}`}</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className={cn('text-[#adfa1d]')}>+20.1% </span>
                                            from last
                                            <span>
                                          {" "}
                                                {format(new Date(date?.from || new Date()), 'yyyy-MM-dd')}
                                            </span>
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total revenue for the year
                                            {/*    todo*/}
                                        </CardTitle>
                                        <Icons.persons className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">+2350</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className={cn('text-[#adfa1d]')}>+180.1% </span>
                                            from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Gross profit</CardTitle>
                                        {/*todo*/}
                                        <CreditCard className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">+12,234</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className={'text-[#FA7A1E]'}>+19% </span>
                                            from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Active Now
                                        </CardTitle>
                                        <Icons.sparkline className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">+573</div>
                                        <p className="text-xs text-muted-foreground">
                                            +201 since last hour
                                        </p>
                                    </CardContent>
                                </Card>
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
                                <RecentSales />
                                <SalesLineChart data={data as Sale[]} date={date} />
                                <DynamicChart
                                    className="col-span-3"
                                    data={data!}
                                    date={date}
                                    title={'Sales'}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="Sales Table">
                            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                                <div className="flex items-center justify-between space-y-2">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            Welcome back {employee?.Name}!
                                        </h2>
                                        <p className="text-muted-foreground">
                                            Here&apos;s a list of your sales for this month!
                                            {/*todo temporary - need some caching or something,queries every time tab is swapped?*/}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="reports">Reports</TabsContent>
                        <TabsContent value="notifications"> {/* temp */}
                            {notifications && notifications.map((notification) =>
                                <div key={notification.title}>
                                    <p>New Sale: {notification.data}</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
