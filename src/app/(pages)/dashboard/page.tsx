'use client'

import {Button} from "@/registry/new-york/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/registry/new-york/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/registry/new-york/ui/tabs"
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
import {Tables} from "@/lib/database.types";
import supabase from "@/lib/supabase";
import {linkGc} from "next/dist/client/app-link-gc";


export default function DashboardPage() {
    const {data, date, setDate} = useDashboard()
    const [totalRevenue, setTotalRevenue] = useState<number>(0);

    useEffect(() => {

  // const fetchTable = async () => {
  //     let {data: Employees, error} = await supabase
  //         .from('Employees')
  //         .select(`
  //   some_column,
  //   Sales (
  //     EmployeeID, Total, SaleTime
  //   )
  // `)
  //         .order('SaleTime', {ascending: true})
  //
  //     console.log(Employees, error)
  //   }
  //   fetchTable()


        setTotalRevenue(data?.map((sale) => sale?.Total).reduce((a, b) => a + b, 0) || 0)
    }, [data, date]);

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
                                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{`$${totalRevenue.toLocaleString()}`}</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className={cn('text-[#adfa1d]')}>+20.1% </span>
                                            from last month
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Subscriptions
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
                                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
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
                                <Card className="col-span-3">
                                    <CardHeader>
                                        <CardTitle>Recent Sales</CardTitle>
                                        <CardDescription>
                                            You made 265 sales this month.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentSales/>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="Sales Table">
                            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                                <div className="flex items-center justify-between space-y-2">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                                        <p className="text-muted-foreground">
                                            Here&apos;s a list of your tasks for this month!
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/*<UserNav />*/}
                                    </div>
                                </div>
                                {/*<DataTable data={tasks} columns={test_columns} />*/}
                            </div>

                        </TabsContent>
                        <TabsContent value="reports">Reports</TabsContent>
                        <TabsContent value="notifications">Notifications</TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
