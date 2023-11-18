'use client'

import {
    Column,
    ColumnDef,
    ColumnFiltersState, flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Employee, Tables, Sale, getSupabaseBrowserClient} from "@/lib/database";
import {ArrowUpDown, Plus} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropDownMenu} from "./drop-down-menu";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DbResult} from "@/lib/types";
import DataTable from "@/components/DataTable";
import {RowActionDialog} from "./RowActionDialog";
import FormModal from "@/components/FormModal";
import {useEmployee} from "@/employee/employee-components/employee-provider";

// todo align rows and columns

/**
 * Component used to render sales page table at `/sales`
 * @group React Components
 */
export default function EmployeeTasksTable() {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [showSaleDialog, setShowSaleDialog] = useState<boolean>(false)
    const supabase = getSupabaseBrowserClient();

    const {
        employee,
        tasks,
        sales,
        date,
        setDate
    } = useEmployee()



    function tooltip(cell:string){
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className={'max-w-[200px] text-sm truncate'}>
                            {cell}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{cell}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    async function onSubmit(data:any) {
        console.log('Table onSubmit: ', data)
        // data["TradeInID"] = 12312
        data["Total"] = 5;
        const fake = {
                "StockNumber": "ew",
                "VehicleMake": "43",
                "CustomerName": "4343",
                "ActualCashValue": 0,
                "GrossProfit": 0,
                "FinAndInsurance": 0,
                "UsedSale": true,
                "EmployeeID": "4ff2a2d7-09a1-4d26-81e1-55fcf9b0f49b",
                "LotPack": 0,
                "DaysInStock": 0,
                "DealerCost": 0,
                "ROI": 0,
                "Total": 5,
                "CustomerCity": "Regina"
            }
        console.log('fake: ', fake)
        await fetch(`http://localhost:3000/api/sale`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fake),
        })
    }

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

    const columns: ColumnDef<Tables<'Sales'>, Employee>[] = [
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
                                {tooltip(employees.find((employee) => employee.id === row.original.EmployeeID)?.Name || 'Employee Name')}
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
                return (tooltip(row.original.VehicleMake))
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

        const table = useReactTable({
        data: sales,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        },
        enableSorting: true,
        enableColumnFilters: true,
    })


    return (
        <DataTable table={table} loading={loading}>
            <Input
                placeholder="Filter sales..."
                value={(table.getColumn("VehicleMake")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("VehicleMake")?.setFilterValue(event.target.value)}
                // todo filter by name --> because html need to get value?
                className="max-w-sm"
            />
            <div className="flex items-center space-x-2 w-full">
                <Button
                     size="sm"
                     variant="outline"
                     className="ml-auto hidden h-8 lg:flex"
                     onClick={() => {
                         // const setFunc = (old: Sale[]) => [...old, newRow];
                         // setSales(setFunc as DbResult<Sale[]>);
                         // table.setSorting([{id: "SaleTime", desc: false,}])
                         setShowSaleDialog(true)
                     }}
                >
                 <Plus className="mr-2 h-4 w-4" />
                 Add Row
                </Button>
             </div>
            <FormModal title={"Create Sale"} showDialog={showSaleDialog} setShowDialog={setShowSaleDialog} onSubmit={onSubmit}>
                <RowActionDialog/>
            </FormModal>
        </DataTable>

    )
}
