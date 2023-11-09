import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import {Button} from "@/components/ui/button";
import CalendarDateRangePicker from "@/app/(pages)/dashboard/components/date-range-picker";


export default function DashboardHeader() {
  const {date, setDate} = useDashboard()
  return (
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={date} setDate={setDate}/>
          <Button>Download</Button>
        </div>
      </div>
  )
}