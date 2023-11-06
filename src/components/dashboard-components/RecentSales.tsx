"use client"
import {useRouter} from "next/navigation";
import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import EmployeeAvatar from "@/components/dashboard-components/EmployeeAvatar";
import useAuth from "@/hooks/use-auth";
import {Employee, getSupabaseBrowserClient} from "@/lib/database";
import {useEffect, useState} from "react";

/* can we have this take an employee? */
function SalesRow({name, email, amount, id}: { name: string; email: string; amount: number; id: string }) {
  // const random = (max: number) => Math.floor(Math.random() * max) + 1
  const router = useRouter()
  const {employee} = useAuth()

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

/*
  this can take a sale later if we want to be very lazy?
 */
export function SalesRowEmployee({employee, amount, saleTime}: { employee: Employee, amount: number, saleTime: Date }) {
  // const random = (max: number) => Math.floor(Math.random() * max) + 1
  // const router = useRouter()
  return (
      <div className="flex items-center border border-background hover:border-border rounded-lg p-2 cursor-pointer"
           // onClick={() => {
           //   router.push(`/profile/${id}`)
           // }}
      >
        <EmployeeAvatar employee={employee}/> {/* for now since no user info yet, just use signed in employee */}
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{employee.Name}</p>
          <p className="text-sm text-muted-foreground">{saleTime.toLocaleString()}</p>
        </div>
        <div className="ml-auto font-medium">
          +${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
        </div>
      </div>
  )
}

/** @ignore these for now */
export function RecentSales() {
  // temp todo add these to dashboard and pull with useDashboard()
  const supabase = getSupabaseBrowserClient();
  const [data, setData] = useState<{id: number, SaleTime: string | null, Total: number, Employee: Employee}[] | null>(null)
  useEffect(() => {
    async function getData() { // TEMP
      const {data, error} = await supabase.from("Sales").select(`
      id, SaleTime, Total,
      Employee: EmployeeID (*)
    `).order("SaleTime", {ascending:false})
      if (error) console.error(error);
      setData(data as {id: number, SaleTime: string | null, Total: number, Employee: Employee}[] | null);
    }
    getData()
  }, [supabase]);


  const {date, setDate} = useDashboard()
  return (
      <div className="space-y-2 max-h-80 overflow-y-scroll no-scrollbar">
        {data?.map((sale) => (
            <SalesRowEmployee key={sale.id}
                              employee={sale.Employee}
                              amount={sale.Total}
                              saleTime={new Date(sale.SaleTime!)}
            />
        ))}

        {/*{SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}*/}
        {/*{SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}*/}
        {/*{SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}*/}
        {/*{SalesRow({name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00, id:'123'})}*/}
      </div>
  )
}
