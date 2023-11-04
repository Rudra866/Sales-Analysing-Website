import {
  Column,
  ColumnDef,
  ColumnFiltersState, flexRender,
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, Row,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon} from "@radix-ui/react-icons";
import {Checkbox} from "@/components/ui/checkbox";
import {Employee, Role} from "@/lib/database.types";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FormModal from "@/app/(pages)/admin/employees/components/FormModal";
import {EmployeeSelectModalForm} from "@/app/(pages)/admin/employees/components/EmployeeSelectModalForm";
import {RoleSelectModalForm} from "@/app/(pages)/admin/employees/components/RoleSelectModalForm";
import {getSupabaseBrowserClient} from "@/lib/supabase";

export default function EmployeeTable() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    function fetchData() {
      return Promise.all([
        supabase.from('Employees').select(),
        supabase.from('Roles').select(),
      ]);
    }
    async function loadData() {
      try {
        setLoading(true);
        const [employeeData, roleData] = await fetchData();
        const { data: employees, count: employeeCount, error: employeeError} = employeeData;
        const { data: roles, count: roleCount, error: roleError } = roleData;

        if (employeeError || roleError) {
          console.error("Supabase error: ", (employeeError ?? roleError));
          throw new Error("Failed to load employee or roles data.");
        }

        setEmployees(employees);
        setRoles(roles);
      } catch (error) {
        console.error(error);
      }
    }
    loadData().then(()=> setLoading(false));
  }, [supabase]);

  function updateEmployee(employee:Employee) {
    const originalEmployees = [...employees]
    const updatedEmployees = originalEmployees
        .map((oldEmployee) => oldEmployee.id === employee.id ? employee: oldEmployee)
    setEmployees(updatedEmployees)
  }
  function DropDownMenu(row:Row<Employee>, roles: Role[]) {
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const employee = row.original;
    return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.EmployeeNumber)}>
                Copy employees id
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEmployeeModal(true)}>
                <span>Show Employee</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=> setShowRoleModal(true)}>
                <span>Change Role</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FormModal title={"Employee"} showDialog={showEmployeeModal} setShowDialog={setShowEmployeeModal}>
            <EmployeeSelectModalForm roles={roles} updateEmployee={updateEmployee} employee={row.original} setShowDialog={setShowEmployeeModal}/>
          </FormModal>
          <FormModal title={"Employee"} showDialog={showRoleModal} setShowDialog={setShowRoleModal}>
            <RoleSelectModalForm row={row} roles={roles} updateEmployee={updateEmployee} />
          </FormModal>

        </>
    );
  }

  function SortButton(name:string, column:Column<Employee>) {
    return (
        <Button
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {name}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
  }

  const columns: ColumnDef<Employee, any>[] = [
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
      accessorKey: "Email",
      header: ({column}) => SortButton("Email", column),
    },
    {
      accessorKey: "Role",
      header: ({column}) => SortButton("Role", column),
      cell: ({row}) => roles.find((role) => role.id === row.original.Role)?.RoleName
    },
    {
      header: ({column}) => SortButton("Last Accessed", column),
      cell: ({row}) => new Date(row.original.LastAccessed).toDateString(),
      accessorKey: "LastAccessed",
    },
    {
      id: "actions",
      cell: ({ row }) => DropDownMenu(row, roles),
    },
  ]

  return (
      <DataTable columns={columns} data={employees}/>
  )
}


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
export function DataTable<TData, TValue>({
                                        data,
                                        columns
                                      }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const pageSizes = [10, 25, 50, 100]

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
    <div className="space-y-4">
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
                  {headerGroup.headers.map((header) =>
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                      </TableHead>
                  )}
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
            {table.getFilteredRowModel().rows.length} employee(s) selected.
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
    </div>
  )
}
