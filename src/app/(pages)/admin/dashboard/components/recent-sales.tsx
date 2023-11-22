
import {useDashboard} from "./dashboard-provider";
import EmployeeAvatar from "@/components/employee-avatar";
import * as React from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {format} from "date-fns";
import {Employee} from "@/lib/database";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";

export function RecentSales({className}: { className?: string }) {
    const {saleWithEmployeeAndFinancing, mySales} = useDashboard()
    function SalesRow({employee, vehicle, amount, id, date}: {
        employee?: Employee;
        vehicle?: string;
        amount?: number;
        id: string,
        date: string
    }) {
        return (
            <div
                className="flex items-center border border-background hover:border-border rounded-lg p-2 cursor-pointer"
                onClick={() => {
                    console.log("employee id: ", id)
                }}
            >
                <EmployeeAvatar employee={employee}/> {/* for now since no user info yet, just use signed in employee */}
                <div className="ml-4 space-y-1">
                    {employee && <p className="text-sm font-medium leading-none">{employee.Name}</p>}
                    <p className="text-sm text-muted-foreground">{format(new Date(date), "LLL dd, y")}</p>
                </div>
                <div className="ml-auto flex flex-col items-end ">
                    {amount && <p className="text-sm font-medium leading-none">+${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>}
                    {vehicle && <p className="text-sm text-muted-foreground truncate max-w-[200px]">{vehicle}</p>}
                </div>
            </div>

        )
    }

    return (
        <Tabs defaultValue="Sales Overview" className={cn("space-y-4 border rounded-xl p-4", className)}>
            <TabsList>
                <TabsTrigger value="Sales Overview">Sales Overview</TabsTrigger>
                <TabsTrigger value="My Sales">My Sales</TabsTrigger>
            </TabsList>
            <TabsContent value="Sales Overview" className="space-y-4">
                <ScrollArea className="h-96">
                    <div className="space-y-2 mr-4">
                        {saleWithEmployeeAndFinancing?.slice(0, 10)?.map((sale) => {
                            return (
                                <SalesRow
                                    key={sale.SaleTime}
                                    employee={sale.Employees}
                                    vehicle={sale.VehicleMake}
                                    amount={sale.Total}
                                    id={sale.EmployeeID}
                                    date={sale.SaleTime!}
                                />
                            )
                        })}
                    </div>
                    <ScrollBar/>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="My Sales" className="space-y-4">
                <ScrollArea className="h-96">
                    <div className="space-y-2 mr-4">

                        {/*todo if you refresh the page you get undefined for auth employee*/}
                        {mySales?.map((sale) => {
                            return (
                                <SalesRow
                                    key={sale.SaleTime}
                                    employee={sale.Employees}
                                    vehicle={sale.VehicleMake}
                                    amount={sale.Total}
                                    id={sale.EmployeeID}
                                    date={sale.SaleTime!}
                                />
                            )
                        })}
                    </div>
                    <ScrollBar/>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    )
}
