import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import {useEffect, useState} from "react";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import useAuth from "@/hooks/use-auth";
import {DbResult} from "@/lib/types";
import {getAllNotifications} from "@/lib/database";
import {format} from "date-fns";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CreditCard, DollarSign} from "lucide-react";
import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {Overview} from "@/app/(pages)/dashboard/components/overview";
import {RecentSales} from "@/app/(pages)/dashboard/components/recent-sales";
import * as React from "react";

export default function Dashboard() {
  const {data, date, setDate} = useDashboard()
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalGoal, setTotalGoal] = useState<number[]>([]);
  const [totalRevenueForTheYear, setTotalRevenueForTheYear] = useState<number>(0);
  const [totalRevMonth, setTotalRevMonth] = useState<number>(0);
  const supabase = getSupabaseBrowserClient();
  const {user, employee} = useAuth();

  type SalesGoalFragment = {
    TotalGoal: number;
    EndDate: string;
  }

  useEffect(() => {
    try {
      const fetchTable = async () => {
        const { data: SalesGoals, error } = await supabase
            .from('SalesGoals')
            .select('TotalGoal, EndDate')
        setTotalGoal(SalesGoals as DbResult<SalesGoalFragment[]>);
      }

      fetchTable();

    } catch (error) {
      console.error(error) // todo handle better later
    }
  }, [supabase]);


  useEffect(() => {
    setTotalRevenue(data
        ?.map((sale) => sale?.Total)
        .reduce((a, b) => a + b, 0) ?? 0)
  }, [data, date, supabase]);

  useEffect(() => {
    const fetchTable = async () => {
      let { data: MonthlySales, error } = await supabase
          .from('MonthlySales')
          .select('Total, GrossProfit, TimePeriod');

      const month = format(new Date(), 'yyyy-MMM');
      const monthlySales = MonthlySales?.filter((sale) => format(
          new Date(sale?.TimePeriod || new Date())
          , 'yyyy-MMM') === month)?.map((sale) => sale?.Total)?.reduce((a, b) => a + b, 0) || 0

      setTotalRevMonth(monthlySales as DbResult<typeof monthlySales[]>);
    };

    fetchTable();

  }, [])
  return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/*todo  total revenue for the month - total estimated sales*/}
              <CardTitle className="text-sm font-medium">Total Revenue for the month</CardTitle>
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
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview/>
            </CardContent>
          </Card>
        </div>
      </>
  )
}