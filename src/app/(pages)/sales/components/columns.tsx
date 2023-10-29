import {Column, ColumnDef} from "@tanstack/react-table";
import {Employee, Tables} from "@/lib/database.types";
import {Checkbox} from "@/components/ui/checkbox";
import {Badge} from "@/components/ui/badge";
import React from "react";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import {DropDownMenu} from "@/app/(pages)/sales/components/drop-down-menu";

function SortButton(name: string, column: Column<Tables<'Sales'>>) {
    // todo does not work for employee names

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


export const columns: ColumnDef<Tables<'Sales'>, Employee>[] = [
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
                <p className={'text-sm'}>
                    {new Date(row.original.SaleTime || new Date()).toDateString()}
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
                <div className="flex space-x-2">
                    <Badge variant="outline">
                            <span className="max-w-[500px] truncate font-medium">
                                {employees.find((employee) => employee.id === row.original.EmployeeID)?.Name}
                            </span>
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "VehicleMake",
        header: ({column}) => SortButton("VehicleMake", column),
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
