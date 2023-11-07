"use client"
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {ReactElement, useEffect, useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
  Employee,
  getAllEmployees,
  getAllNotifications,
  getAllRoles,
  getAllSales,
  getAllSalesGoals,
  getAllTasks,
  Role,
  Sale,
  SalesGoal,
  Task,
  Notification,
  getAllMonthlySales,
  MonthlySale,
  getSalesGoal,
  TradeIn,
  Financier,
  Customer,
  getAllTradeIns,
  getAllCustomers, getAllFinancingOptions
} from "@/lib/database";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CaretSortIcon} from "@radix-ui/react-icons";


export default function SupabaseTestPage() {
  const supabase = getSupabaseBrowserClient();
  const [employeeData, setEmployeeData] = useState<Employee[] | null>([])
  const [salesData, setSalesData] = useState<Sale[] | null>([])
  const [salesGoalsData, setSalesGoalsData] = useState<SalesGoal[] | null>([])
  const [tasksData, setTasksData] = useState<Task[] | null>([])
  const [errors, setErrors] = useState<any[]>([])
  const [rolesData, setRolesData] = useState<Role[] | null>([])
  const [notificationData, setNotificationData] = useState<Notification[] | null>([])
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySale[] | null>([])
  const [tradeInsData, setTradeInsData] = useState<TradeIn[] | null>([])
  const [customerData, setCustomerData] = useState<Customer[] | null>([])
  const [financingData, setFinancingData] = useState<Financier[] | null>([])

  useEffect(() => {
    const getData = async () => {
      try {
        setEmployeeData(await getAllEmployees(supabase));
        setSalesData(await getAllSales(supabase));
        setMonthlySalesData(await getAllMonthlySales(supabase));
        setSalesGoalsData(await getAllSalesGoals(supabase));
        setTasksData(await getAllTasks(supabase));
        setRolesData(await getAllRoles(supabase));
        setNotificationData(await getAllNotifications(supabase));
        setTradeInsData(await getAllTradeIns(supabase));
        setCustomerData(await getAllCustomers(supabase));
        setFinancingData(await getAllFinancingOptions(supabase));
      } catch (error) {
        setErrors(e =>[...e, error])
      }

    }

    getData()
  }, [supabase]);
  if (!employeeData) {
    return <>Pending</>
  }

  return (
    <div className={"mx-4 my-4"}>
      <CollapsableRawData data={employeeData}><p>Employee</p></CollapsableRawData>
      <CollapsableRawData data={salesData}><p>Sales</p></CollapsableRawData>
      <CollapsableRawData data={monthlySalesData}><p>Monthly Sales</p></CollapsableRawData>
      <CollapsableRawData data={salesGoalsData}><p>Sales Goals</p></CollapsableRawData>
      <CollapsableRawData data={tasksData}><p>Tasks</p></CollapsableRawData>
      <CollapsableRawData data={rolesData}><p>Roles</p></CollapsableRawData>
      <CollapsableRawData data={notificationData}><p>Notifications</p></CollapsableRawData>
      <CollapsableRawData data={tradeInsData}><p>Trade Ins</p></CollapsableRawData>
      <CollapsableRawData data={customerData}><p>Customers</p></CollapsableRawData>
      <CollapsableRawData data={financingData}><p>Financiers</p></CollapsableRawData>
    </div>)
}

const CollapsableRawData = ({data, children}: {data: any, children: ReactElement}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger>
        <Button variant="ghost" size="lg">
          {children}
          <CaretSortIcon className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      {data?.map((entry: any) =>
          <CollapsibleContent key={entry.id}>{JSON.stringify(entry, null, 2)}</CollapsibleContent>)}
    </Collapsible>
  );
}