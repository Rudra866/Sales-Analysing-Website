import {ColumnDef} from "@tanstack/react-table";
import {Employee, Tables, Task} from "@/lib/database";
import {Checkbox} from "@/components/ui/checkbox";
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge";
import tableTooltip from "@/components/table-tooltip";
import {DropDownMenu} from "@/employee/tasks/components/drop-down-menu";
import React from "react";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";



function SortButton(name: string, column: Task[]) {
    return (
        <Button
            size="sm"
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/70"/>
        </Button>
    )
}


export const columns: ColumnDef<Task, Employee>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "SaleTime",
        // header: ({column}) => SortButton("SaleTime", column),
        header: ({column}) => SortButton("SaleTime", column),
        cell: ({row}) => {
            return (
                <p className={'text-sm min-w-fit'}>
                    {/*{new Date(row.original.SaleTime || new Date()).toDateString()}*/}
                    {/*{format(new Date(row.original.SaleTime || new Date()), 'yyyy-MMM-dd')}*/}
                    {format(new Date(row.original.SaleTime || new Date()), "LLL dd, y")}
                </p>
            )
        },
    },
    // {
    //     accessorKey: "EmployeeID",
    //     header: ({column}) => SortButton("EmployeeID", column)
    // },
    {
        accessorKey: "Name",
        header: ({column}) => SortButton("Name", column),
        cell: ({row}) => {
            // return employees.find((employee) => employee.id === row.original.EmployeeID)?.Name
            return (
                <div className="flex space-x-2 ml-1">
                    <Badge variant="outline">
                            <span className="max-w-[200px] truncate font-medium">
                                {tableTooltip(employees.find((employee) => employee.id === row.original.EmployeeID)?.Name || 'Employee Name')}
                            </span>
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "VehicleMake",
        header: ({column}) => SortButton("VehicleMake", column),
        cell: ({row}) => {
            return (tableTooltip(row.original.VehicleMake))
        }
    },
    {
        accessorKey: "ActualCashValue",
        header: ({column}) => SortButton("ActualCashValue", column),
        cell: ({row}) => `$${row.original.ActualCashValue.toLocaleString()}`,
    },
    {
        accessorKey: "GrossProfit",
        header: ({column}) => SortButton("GrossProfit", column),
        cell: ({row}) => `$${row.original.GrossProfit.toLocaleString()}`,
    },
    {
        accessorKey: "FinAndInsurance",
        header: ({column}) => SortButton("FinAndInsurance", column),
        cell: ({row}) => `$${row.original.FinAndInsurance.toLocaleString()}`,
    },
    {
        accessorKey: "Holdback",
        header: ({column}) => SortButton("Holdback", column),
        cell: ({row}) => {return row.original.Holdback ? `$${row.original.Holdback.toLocaleString()}`: '0'},
    },
    {
        accessorKey: "Total",
        header: ({column}) => SortButton("Total", column),
        cell: ({row}) => `$${row.original.Total.toLocaleString()}`,
    },
    {
        id: "actions",
        cell: ({row}) => DropDownMenu({row, sales, setSales}),
    },
]
