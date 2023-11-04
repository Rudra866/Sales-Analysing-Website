import {useRouter} from "next/navigation";
import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import EmployeeAvatar from "@/components/dashboard-components/EmployeeAvatar";
import useAuth from "@/hooks/use-auth";

/** @ignore these for now */
export function RecentSales() {
  const {date, setDate} = useDashboard()
  const {employee} = useAuth()

  /* can we have this take an employee? */
  function SalesRow({name, email, amount, id}: { name: string; email: string; amount: number; id: string }) {
    // const random = (max: number) => Math.floor(Math.random() * max) + 1
    const router = useRouter()

    return (
        <div className="flex items-center border border-background hover:border-border rounded-lg p-2 cursor-pointer"
             onClick={() => {
               router.push(`/profile/${id}`)
             }}
        >
          <EmployeeAvatar employee={employee!}/> {/* for now since no user info yet, just use signed in employee */}
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
          </div>
        </div>

    )
  }


  return (
      <div className="space-y-2">
        {SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}
        {SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}
        {SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}
        {SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}
      </div>
  )
}
