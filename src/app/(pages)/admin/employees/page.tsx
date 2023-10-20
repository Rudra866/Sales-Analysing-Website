'use client'
import { Button } from "@/registry/new-york/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import React, {useEffect, useState} from "react";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/database.types"
import {
  ColumnDef, getCoreRowModel, useReactTable, getPaginationRowModel,
  flexRender, SortingState, getSortedRowModel, Column, Row, ColumnFiltersState, getFilteredRowModel, SortingFnOption
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon} from "@radix-ui/react-icons";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select"

export interface Employee extends Tables<"Employees"> {}
export interface Role extends Tables<"Roles"> {}

const pageSizes = [10, 25, 50, 100]

// Create a custom sorting function for date strings
const dateSortLastAccessed: SortingFnOption<Employee> = (a, b) => {
  // You can parse the date strings into JavaScript Date objects and compare them.
  const dateA = new Date(a.original.LastAccessed);
  const dateB = new Date(a.original.LastAccessed);

  return dateA.getTime() - dateB.getTime();
};

function fetchData() {
  return Promise.all([
    supabase.from('Employees').select('*').range(0, 100),
    supabase.from('Roles').select('*').range(0, 100),
  ]);
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function EmployeeTable<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
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
      <>
        <div className="flex items-center py-4">
          <Input
              placeholder="Filter employees..."
              value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("Name")?.setFilterValue(event.target.value)}
              className="max-w-sm"/>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                          </TableHead>
                      )
                    })}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent >
                    {pageSizes.map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}

function SortButton(name:string, column:Column<Employee>) {
  return (
      <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {name}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
  )
}

function DropDownMenu(row:Row<Employee>) {
  const employee = row.original;
  return (<DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(employee.EmployeeNumber)}>
        Copy employees id
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>View employee</DropdownMenuItem>
      <DropdownMenuItem>Change Role</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>);
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [employeeData, roleData] = await fetchData();
        const { data: employees, count: employeeCount } = employeeData;
        const { data: roles, count: roleCount } = roleData;

        setEmployees(employees as Employee[]);
        setRoles(roles as Role[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData().then(()=>console.log(employees));
  }, []);


  // @ts-ignore
  const columns: ColumnDef<Employee>[] = [
    {
      id: "select",
      header: ({ table }) => (
          <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
          />
      ),
      cell: ({ row }) => (
          <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
          />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "EmployeeNumber",
      header: ({column}) => SortButton("Employee Number", column),
    },
    {
      accessorKey: "Name",
      header: ({column}) => SortButton("Name", column)
    },
    {
      // accessorKey: "Email", -- not fully added to db yet
      id: "0", // why needed
      header: ({column}) => SortButton("Email", column),
    },
    {
      accessorKey: "Role",
      header: ({column}) => SortButton("Role", column),
      cell: ({row}) => roles.find((role) => role.id === row.original.Role)?.RoleName
    },
    {
      id: "1",
      header: ({column}) => SortButton("Last Accessed", column),
      cell: ({row}) => new Date(row.original.LastAccessed).toDateString(),
      accessorKey: "EmployeeNumber",
      sortingFn: dateSortLastAccessed,
      enableSorting: true,
    },
    {    id: "actions",
      cell: ({ row }) => DropDownMenu(row),
    },
  ]
  if (loading) {
    return (
        [...Array(12)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
        ))
    );
  } else {
    return <div>
      <EmployeeTable columns={columns} data={employees}/>
    </div>
  }
}
