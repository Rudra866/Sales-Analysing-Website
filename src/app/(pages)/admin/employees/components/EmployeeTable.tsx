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
import {Employee, Role, getSupabaseBrowserClient, Database, SupabaseClient} from "@/lib/database";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FormModal from "@/components/FormModal";
import {EmployeeSelectModalForm} from "@/app/(pages)/admin/employees/components/EmployeeSelectModalForm";
import {RoleSelectModalForm} from "@/app/(pages)/admin/employees/components/RoleSelectModalForm";
import TablePagination from "@/components/TablePagination";

/**
 * Component to create a table to render all employees in the database.
 * @group React Components
 */
export default function EmployeeTable() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
  useEffect(() => {
    function fetchData() {
      return Promise.all([
        supabase.from('Employees').select(),
        supabase.from('Roles').select(),
      ]);
    }
    async function loadData() {
      try {
        console.log(await supabase.auth.getSession())
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

  type DropDownMenuProps = {
    row: Row<Employee>,
    roles: Role[],
  }
  function DropDownMenu({row, roles}: DropDownMenuProps) {
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
            <RoleSelectModalForm employee={row.original} roles={roles} updateEmployee={updateEmployee} />
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
      id: "actions",
      cell: ({ row }) => <DropDownMenu row={row}  roles={roles}/>,
    },
  ]

  return (
      <DataTable columns={columns} data={employees}/>
  )
}


export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

/**
 * Component to create a table as model for {@link EmployeeTable}
 * @group React Components
 */
function DataTable<TData, TValue>({
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
      <div className="flex items-center">
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
        <TablePagination table={table} pageSizes={pageSizes}/>
      </div>
    </div>
  )
}
