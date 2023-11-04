"use client"
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {ReactElement, useEffect, useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
  Employee,
  getAllEmployees, getAllNotifications, getAllRoles,
  getAllSales,
  getAllSalesGoals,
  getAllTasks, Role,
  Sale,
  SalesGoal,
  Task
} from "@/lib/database";


export default function SupabaseTestPage() {
  const supabase = getSupabaseBrowserClient();
  const [employeeData, setEmployeeData] = useState<Employee[] | null>([])
  const [salesData, setSalesData] = useState<Sale[] | null>([])
  const [salesGoalsData, setSalesGoalsData] = useState<SalesGoal[] | null>([])
  const [tasksData, setTasksData] = useState<Task[] | null>([])
  const [errors, setErrors] = useState<any[]>([])
  const [rolesData, setRolesData] = useState<Role[] | null>([])
  const [notificationData, setNotificationData] = useState<Notification[] | null>([])


  useEffect(() => {
    const getData = async () => {
      try {
        const employees = await getAllEmployees(supabase);
        setEmployeeData(employees)
        const sales = await getAllSales(supabase);
        setSalesData(sales);
        const salesGoals = await getAllSalesGoals(supabase);
        setSalesGoalsData(salesGoals);
        const tasks = await getAllTasks(supabase);
        setTasksData(tasks);
        const roles = await getAllRoles(supabase);
        setRolesData(roles);
        // const notifications = await getAllNotifications(supabase);
        // setNotificationData(notifications);

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
    <div className={"mx-4"}>
      <>{errors}</>
      <CollapsableRawData data={employeeData}><p>Employee</p></CollapsableRawData>
      <CollapsableRawData data={salesData}><p>Sales</p></CollapsableRawData>
      <CollapsableRawData data={salesGoalsData}><p>Sales Goals</p></CollapsableRawData>
      <CollapsableRawData data={tasksData}><p>Tasks</p></CollapsableRawData>
      <CollapsableRawData data={rolesData}><p>Roles</p></CollapsableRawData>
    </div>)
}

const CollapsableRawData = ({data, children}: {data: any, children: ReactElement}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger>{children}</CollapsibleTrigger>
      {data.map((entry: any) =>
          <CollapsibleContent key={entry.id}>{JSON.stringify(entry, null, 2)}</CollapsibleContent>)}
    </Collapsible>
  );
}