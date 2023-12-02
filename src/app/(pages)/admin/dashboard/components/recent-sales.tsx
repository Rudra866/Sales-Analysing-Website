
import {useDashboard} from "./dashboard-provider";
import EmployeeAvatar from "@/components/employee-avatar";
import * as React from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {format} from "date-fns";
import {Employee} from "@/lib/database";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import {DataTableFacetedFilter} from "@/components/data-table-faceted-filter";
import {useState} from "react";
import {Select} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";

export default function RecentSales({className}: { className?: string }) {
    const {
        saleWithEmployeeAndFinancing,
        mySales,
        employees
    } = useDashboard()

    const [selectedEmployees, setSelectedEmployees] = useState<string>()
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
                <EmployeeAvatar employee={employee}/>
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
    const names = employees?.map(employee => {
        return {
            label: employee.Name,
            value: employee.id.toString()
        }
    })
    // filter sales by selected employees
    const filteredSales = saleWithEmployeeAndFinancing?.filter((sale) => {
        return selectedEmployees?.includes(sale.EmployeeID)
    })

    return (
        <Tabs defaultValue="Sales Overview" className={cn("space-y-4 border rounded-xl p-4", className)}>
            <TabsList>
                <TabsTrigger value="Sales Overview">Sales Overview</TabsTrigger>
                <TabsTrigger value="Employee Sales">Employee Sales</TabsTrigger>
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
            <TabsContent value="Employee Sales" className="space-y-4">
                <ScrollArea className="h-96">
                    <div className="space-y-2 mr-4">
                        <Combobox
                            employees={names!}
                            setSelectedValue={(value) => {
                                setSelectedEmployees(value)
                            }}
                        />
                        {filteredSales?.map((sale) => {
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

type ComboBoxOption = {
    employees: { label: string; value: string }[]
    setSelectedValue: (value: string) => void
}

export function Combobox({employees, setSelectedValue}:ComboBoxOption) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? employees.find((employee) => employee.value === value)?.label
                        : "Select employee..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    {/*<CommandInput placeholder="Search employee..." className="h-9" />*/}
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <ScrollArea className="h-[400px]">
                        <CommandGroup>
                            {employees.map((employee) => (
                                <CommandItem
                                    key={employee.value}
                                    value={employee.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        setSelectedValue(currentValue)
                                    }}
                                >
                                    {employee.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === employee.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea>

                </Command>
            </PopoverContent>
        </Popover>
    )
}
