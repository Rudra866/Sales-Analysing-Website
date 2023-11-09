import useAuth from "@/hooks/use-auth";

export default function DashboardSalesTable() {
  const {employee} = useAuth();
  return (
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back {employee?.Name}!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your sales for this month!
              {/*<SalesTable/> */}
              {/* temporary - need some caching or something,
                                            queries every time tab is swapped.*/}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/*<UserNav />*/}
          </div>
        </div>
        {/*<DataTable data={tasks} columns={test_columns} />*/}
      </div>
  )
}