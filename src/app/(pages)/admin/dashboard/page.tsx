'use client'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {useDashboard} from "./components/dashboard-provider";
import {getSalesCSV} from "@/lib/csv";
import dynamic from "next/dynamic";

/* Can probably optimize this down the line. */
const SalesLineChart = dynamic(() => import(`@/components/sales-line-chart`))
const Overview = dynamic(() => import(`./components/overview`))
const RecentSales = dynamic(() => import(`./components/recent-sales`))
const DynamicChart = dynamic(() => import(`@/components/dynamic-chart`))
const CalendarDateRangePicker = dynamic(() => import(`@/components/date-range-picker`))
const SummaryCard = dynamic(() => import('./components/summary-card'));
const CountCard = dynamic(() => import('./components/count-card'));


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
                            <Button onClick={() => getSalesCSV(date)}>Download</Button>
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
                        <SalesLineChart/>
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
