"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const SalesTable =
    dynamic(() => import('@/components/tables/sales-table'))

const EmployeeTable =
    dynamic(() => import('@/components/tables/employee-table'))

const TasksTable =
    dynamic(() => import('@/components/tables/task-table'))

const SalesGoalsTable =
    dynamic(() => import('@/components/tables/sales-goal-table'))

export default function TestTables() {
  return (
        <Tabs className={"mx-3 my-3"} defaultValue="sales" >
          <TabsList className={"overflow-clip rounded-[0.5rem] border bg-background shadow"}>
            <TabsTrigger value="sales">Sales Table</TabsTrigger>
            <TabsTrigger value="employee">Employee Table</TabsTrigger>
            <TabsTrigger value="tasks">Tasks Table</TabsTrigger>
            <TabsTrigger value="saleGoals">Sale Goals Table</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="p-2 overflow-clip rounded-[0.5rem] border bg-background shadow">
            <>No longer connected to database.</>
            <SalesTable data={[]} loading={false} employees={[]}/>
          </TabsContent>
          <TabsContent value="employee" className="p-2 overflow-clip rounded-[0.5rem] border bg-background shadow">
            <>No longer connected to database.</>
            <EmployeeTable data={[]} roles={[]} loading={false}/>
          </TabsContent>
          <TabsContent value="tasks" className="p-2 overflow-clip rounded-[0.5rem] border bg-background shadow">
            <>No longer connected to database.</>
            <TasksTable data={[]} employees={[]} loading={false}/>
          </TabsContent>
          <TabsContent value="saleGoals" className="p-2 overflow-clip rounded-[0.5rem] border bg-background shadow">
            <>No longer connected to database.</>
            <SalesGoalsTable data={[]} employees={[]} loading={false} monthlySales={[]}/>
          </TabsContent>
          <TabsContent value="other">
            <p>Nothing here yet.. how about you go make one?</p>
          </TabsContent>
        </Tabs>
  )
}
