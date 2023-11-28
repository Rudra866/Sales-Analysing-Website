"use client";
import { Button } from "@/components/ui/button";
import { useDashboard } from "./components/dashboard-provider";
import { getSalesCSV } from "@/lib/csv";
import dynamic from "next/dynamic";

const RecentSales = dynamic(() => import(`./components/recent-sales`));
const CalendarDateRangePicker = dynamic(
  () => import(`@/components/date-range-picker`),
);
const SummaryCard = dynamic(() => import("./components/summary-card"));
const CountCard = dynamic(() => import("./components/count-card"));
import { Suspense } from "react";
import LoadingAnimation from "@/components/loading-animation";
import { Overview } from "@/admin/dashboard/components/overview";
import { DynamicChart } from "@/components/dynamic-chart";
import SalesLineChart from "@/components/sales-line-chart";

// TODO maybe we can split this page to some public components? We can also add db method to handle this db request.
/**
 * Main dashboard page for the app.
 * @group Next.js Pages
 * @route `/dashboard`
 */
export default function DashboardPage() {
  const { data, date, setDate, isLoading } = useDashboard();
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-2 md:p-8 pt-6">
          <div className="flex items-start justify-start space-y-2 lg:flex-row flex-col">
            <h2 className="w-full text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <div className="w-fit flex space-x-2 lg:flex-row flex-col gap-2 justify-end">
              <CalendarDateRangePicker date={date} setDate={setDate} />
              <Button onClick={() => getSalesCSV(date)}>Download</Button>
            </div>
          </div>
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <section className={"w-full space-y-2"}>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard defaultCategory={"Total"} />
                <SummaryCard defaultCategory={"GrossProfit"} />
                <SummaryCard defaultCategory={"DealerCost"} />
                <CountCard />
              </div>

              <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
                <Overview className={"col-span-2 lg:col-span-4"} />
                <RecentSales className={"col-span-2 lg:col-span-3"} />
                <SalesLineChart className={"col-span-2 lg:col-span-4"} />
                <DynamicChart
                  className="col-span-2 lg:col-span-3"
                  data={data!}
                  date={date}
                  title={"Sales"}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </Suspense>
  );
}
