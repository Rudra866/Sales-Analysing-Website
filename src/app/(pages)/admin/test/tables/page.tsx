"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import Loading from "@/app/(pages)/dashboard/loading";

const SalesTable =
    dynamic(() => import('@/app/(pages)/sales/components/SalesTable'))

const EmployeeTable =
    dynamic(() => import('@/components/EmployeeTable'))

export default function TestTables() {
  return (
        <Tabs className={"mx-3 my-3"} defaultValue="sales" >
          <TabsList className={"overflow-clip rounded-[0.5rem] border bg-background shadow"}>
            <TabsTrigger value="sales">Sales Table</TabsTrigger>
            <TabsTrigger value="employee">Employee Table</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="p-2 overflow-clip rounded-[0.5rem] border bg-background shadow">
            <SalesTable/>
          </TabsContent>
          <TabsContent value="employee" className="p-2 overflow-clip rounded-[0.5rem] border bg-background shadow">
            <EmployeeTable/>
          </TabsContent>
          <TabsContent value="other">
            <p>Nothing here yet.. how about you go make one?</p>
          </TabsContent>
        </Tabs>
  )
}