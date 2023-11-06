'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, Row,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import React, {useCallback, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Employee, Sale, getSupabaseBrowserClient, getAllSales, getAllEmployees} from "@/lib/database";
import {MoreHorizontal, Plus} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FormModal from "@/components/FormModal";
import {Badge} from "@/components/ui/badge";
import {AddSalesRowDialog} from "@/app/(pages)/sales/components/AddSalesRowDialog";
import TableSortButton from "@/components/TableSortButton";
import DataTable from "@/components/DataTable";
// todo align rows and columns

/**
 * Component used to render sales page table at `/sales`
 * @group React Components
 */
export default function SalesTable() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState<Sale[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const supabase = getSupabaseBrowserClient();
    const [salesModal, setSalesModal] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setSales(await getAllSales(supabase) ?? [])
                setEmployees(await getAllEmployees(supabase) ?? [])
            } catch (error) {
                console.error("Supabase error: ", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [supabase]);

    const updateSales = useCallback((sale: Sale) => {
        const updatedSales = sales
            .map((oldSale) => oldSale.id === sale.id ? sale : oldSale);
        setSales(updatedSales);
    }, [sales]);

    function DropDownMenu(sale: Row<Sale>) {
        const [item, setItem] = useState<Sale>();
        return (
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sale.original.EmployeeID.toString())}>
                            Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={
                            () => {
                                setItem(sale.original)
                                setSalesModal(true)
                            }
                        }>
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => {
                            sale.original.id && supabase.from('Sales').delete().eq('id', sale.original.id)
                                .then(() => {
                                const originalSales = [...sales]
                                const updatedSales = originalSales.filter((oldSale) => oldSale.id !== sale.original.id)
                                setSales(updatedSales)
                            })
                        }}>
                            Delete
                            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {sale.original &&
                    <FormModal title={"Sale"} onSubmit={updateSales} showDialog={salesModal} setShowDialog={setSalesModal}>
                         <AddSalesRowDialog sale={sale.original}/>
                    </FormModal>
                }
            </>
        );
    }

    const columns: ColumnDef<Sale, any>[] = [
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
            header: ({column}) => <TableSortButton column={column}/>,
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
        //     header: ({column}) => <TableSortButton column={column}/>,
        // },
        {
            accessorKey: "Name",
            header: ({column}) => <TableSortButton column={column}/>,
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
            header: ({column}) => <TableSortButton column={column}/>,
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
            cell: ({row}) => {return row.original.Holdback ? `$${row.original.Holdback.toLocaleString()}`: '0'},
        },
        {
            accessorKey: "Total",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => `$${row.original.Total.toLocaleString()}`,
        },
        {
            id: "actions",
            cell: ({row}) => DropDownMenu(row),
        },
    ]

    const table = useReactTable({
        data: sales,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        },

    })

    return (
        <DataTable table={table} loading={loading}>
            <Input
                placeholder="Filter sales..."
                value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("Name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
            <Button
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
                onClick={() => console.log("Add row")}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Row
            </Button>
        </DataTable>
    )
}
