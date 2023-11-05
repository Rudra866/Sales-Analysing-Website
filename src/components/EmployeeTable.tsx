import {
  Column,
  ColumnDef,
  ColumnFiltersState, flexRender,
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, Row,
  SortingState, TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import React, {HTMLAttributes, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon} from "@radix-ui/react-icons";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Employee,
  Role,
  getSupabaseBrowserClient,
  Database,
  SupabaseClient,
  getAllEmployees,
  getAllRoles
} from "@/lib/database";
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
import TableSortButton from "@/components/TableSortButton";
import {columns} from "@/app/(pages)/(examples)/tasks/components/columns";
import DataTable, {TableFilter} from "@/components/DataTable";

/**
 * Component to create a table to render all employees in the database.
 * @group React Components
 */
export default function EmployeeTable() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setEmployees(await getAllEmployees(supabase) ?? [])
        setRoles(await getAllRoles(supabase) ?? [])
      } catch (error) {
        console.error("Supabase error: ", error)
        console.error("Failed to load employee or roles data.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase]);

  const updateEmployee = useCallback((employee: Employee) => {
    const originalEmployees = [...employees]
    const updatedEmployees = originalEmployees
        .map((oldEmployee) =>
            oldEmployee.id === employee.id ? employee: oldEmployee)
    setEmployees(updatedEmployees)
  }, [employees]);

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
                Copy Employee Number
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEmployeeModal(true)}>
                <span>Show Employee</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=> setShowRoleModal(true)}>
                <span>Change Role</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* add onUpdate functionality */}
          <FormModal title={"Employee"} onSubmit={(data:any) => {return}} showDialog={showEmployeeModal} setShowDialog={setShowEmployeeModal}>
            <EmployeeSelectModalForm employee={row.original} roles={roles}/>
          </FormModal>
          <FormModal title={"Employee"} onSubmit={(data:any) => {return}} showDialog={showRoleModal} setShowDialog={setShowRoleModal}>
            <RoleSelectModalForm employee={row.original} roles={roles}/>
          </FormModal>
        </>
    );
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
      header: ({column}) => <TableSortButton column={column}/>,
    },
    {
      accessorKey: "Name",
      header: ({column}) => <TableSortButton column={column}/>
    },
    {
      accessorKey: "Email",
      header: ({column}) => <TableSortButton column={column}/>
    },
    {
      accessorKey: "Role",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) => roles.find((role) => role.id === row.original.Role)?.RoleName

    },
    {
      id: "actions",
      cell: ({ row }) => <DropDownMenu row={row}  roles={roles}/>,
    },
  ]

  const table: import("@tanstack/table-core").Table<Employee> = useReactTable({
    data: employees,
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
      // maybe can use provider here to pass less components around?
    <DataTable table={table} loading={loading}>
      <TableFilter table={table} initial={"Name"} placeholder={"Filter employees..."}/>
    </DataTable>
  )
}


