
import {useRouter} from "next/navigation";
import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import useAuth from "@/hooks/use-auth";
import EmployeeAvatar from "@/components/EmployeeAvatar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {format} from "date-fns";
import {getRoleFromEmployee} from "@/lib/database";

/** @ignore these for now */


export function RecentSales() {
    const {saleWithEmployeeAndFinancing, setDate} = useDashboard()
    const {employee} = useAuth()
    // console.log("Auth employee: ", employee?.Role)


    function SalesRow({name, vehicle, amount, id, date}: { name: string; vehicle: string; amount: number; id: string, date: string }) {
        const router = useRouter()
        return (
            <div
                className="flex items-center border border-background hover:border-border rounded-lg p-2 cursor-pointer"
                onClick={() => {
                    // router.push(`/profile/${id}`)
                    console.log("employee id: ", id)
                }}
            >
                <EmployeeAvatar
                    employee={employee!}/> {/* for now since no user info yet, just use signed in employee */}
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(date), "LLL dd, y")}</p>
                </div>
                <div className="ml-auto flex flex-col items-end ">
                    <p className="text-sm font-medium leading-none">+${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{vehicle}</p>
                </div>
            </div>

        )
    }

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                {/*<CardDescription>*/}
                {/*    You made 265 sales this month.*/}
                {/*</CardDescription>*/}
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <div className="space-y-2 mr-4">
                        {saleWithEmployeeAndFinancing?.slice(0,10)?.map((sale) => {
                            return (
                                <SalesRow
                                    key={sale.SaleTime}
                                    name={sale.Employees?.Name!}
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
            </CardContent>
        </Card>

    )
}
