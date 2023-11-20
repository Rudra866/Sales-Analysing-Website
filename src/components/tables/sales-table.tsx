'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Employee, Tables, Sale, getSupabaseBrowserClient, SaleInsert} from "@/lib/database";
import {Plus} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropDownMenu} from "@/employee/sales/components/drop-down-menu";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import DataTable, {TableFilter} from "@/components/tables/DataTable";
import {RowActionDialog} from "@/employee/sales/components/RowActionDialog";
import FormModal from "@/components/dialogs/FormModal";
import useAuth from "@/hooks/use-auth";
import TableSortButton from "@/components/tables/table-sort-button";

/**
 * Component used to render sales page table at `/sales`
 * @group React Components
 */
export default function SalesTable() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState<Sale[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [showSaleDialog, setShowSaleDialog] = useState<boolean>(false)
    const supabase = getSupabaseBrowserClient();

    const {employee} = useAuth();
    useEffect(() => {
        function fetchEmployees() {
            return supabase.from('Employees').select()
        }

        async function fetchSales() {
            const res = await fetch(`/api/sale`, {
                method: "GET"
            })
            return res.json();
        }

        async function loadData() {
            try {
                setLoading(true);
                const {data: employees, error: employeeError} = await fetchEmployees();
                const {data: sales, error: salesError} = await fetchSales();

                if (salesError || employeeError) {
                    console.error("Supabase error: ", (salesError ?? employeeError));
                    throw new Error("Failed to load sales or employees data.");
                }
                setSales(sales);
                setEmployees(employees);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadData().then(() => setLoading(false));
    }, [supabase]);

    function tooltip(cell: string) {
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


    async function onSubmit(data: SaleInsert) {
        data["EmployeeID"] = employee!.id;      // set current user to be the seller
        data["Total"] =                         // set total based on fields input
            (data.GrossProfit) +
            (data.FinAndInsurance) +
            (data.Holdback || 0);
        if (data.ROI) {
            data.ROI = data.ROI / 100           // convert ROI to decimal.
        }
        await fetch(`http://localhost:3000/api/sale`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }

    const columns: ColumnDef<Tables<'Sales'>, Employee>[] = [
        {
            accessorKey: "SaleTime",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => {
                return (
                    <p className={'text-sm min-w-fit'}>
                        {format(new Date(row.original.SaleTime || new Date()), "LLL dd, y")}
                    </p>
                )
            },
        },
        {
            accessorKey: "Name",
            header: ({column}) => <TableSortButton column={column}/>,
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
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => {
                return (tooltip(row.original.VehicleMake))
            }
        },
        {
            accessorKey: "ActualCashValue",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => `$${row.original.ActualCashValue.toLocaleString()}`,
        },
        {
            accessorKey: "GrossProfit",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => `$${row.original.GrossProfit.toLocaleString()}`,
        },
        {
            accessorKey: "FinAndInsurance",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => `$${row.original.FinAndInsurance.toLocaleString()}`,
        },
        {
            accessorKey: "Holdback",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => {
                return row.original.Holdback ? `$${row.original.Holdback.toLocaleString()}` : '0'
            },
        },
        {
            accessorKey: "Total",
            header: ({column}) => <TableSortButton column={column}/>,
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
            <TableFilter table={table} initial={"Name"} placeholder={"Filter sales..."}/>
            <div className="flex items-center space-x-2 w-full">
                <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto hidden h-8 lg:flex"
                    onClick={() => {
                        setShowSaleDialog(true)
                    }}
                >
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Sale
                </Button>
            </div>
            <FormModal title={"Create Sale"} showDialog={showSaleDialog} setShowDialog={setShowSaleDialog}
                       onSubmit={onSubmit}>
                <RowActionDialog/>
            </FormModal>
        </DataTable>

    )
}
