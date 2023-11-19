'use client'

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import CalendarDateRangePicker from "./components/date-range-picker"
import {Overview} from "./components/overview"
import {RecentSales} from "./components/recent-sales"
import * as React from "react";
import {useDashboard} from "./components/dashboard-provider";
import {Sale} from "@/lib/database";
import {DynamicChart} from "@/components/dynamic-chart";
import SalesLineChart from "@/components/sales-line-chart";
import SummaryCard, {CountCard} from "./components/summary-card";
import {toast} from "@/components/ui/use-toast";


async function getSalesCSV() {
    try {
        const response = await fetch(`/api/csv`, {
            method: "GET"
        })

        const responseBody = await response.json();
        if (!response.ok) throw responseBody.error;
        const url = window.URL.createObjectURL(
            new Blob([responseBody.data], {
                type: "text/plain"
            })
        );

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `Sales.csv`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode?.removeChild(link);


    } catch (err) {
        toast({
            title: "Error!",
            description: "File could not be downloaded."
        })
        console.log(err)
    }
}

// TODO maybe we can split this page to some public components? We can also add db method to handle this db request.
/**
 * Main dashboard page for the app.
 * @group Next.js Pages
 * @route `/dashboard`
 */
export default function DashboardPage() {
    const {data, date, setDate} = useDashboard()
    return (
        <>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker date={date} setDate={setDate}/>
                            <Button onClick={() => getSalesCSV()}>Download</Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard defaultCategory={'Total'} />
                        <SummaryCard defaultCategory={'GrossProfit'} />
                        <SummaryCard defaultCategory={'DealerCost'} />
                        <CountCard />
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
