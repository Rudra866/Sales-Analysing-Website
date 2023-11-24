import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Employee, Role, RoleInsert } from "@/lib/database";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FormModal from "@/components/dialogs/form-modal";
import { EmployeeSelectDialog } from "@/components/dialogs/employee-select-dialog";
import DataTable, { TableFilter } from "./data-table";
import useAuth from "@/hooks/use-auth";
import { CreateRoleDialog } from "@/components/dialogs/create-role-dialog";
import TableSortButton from "@/components/tables/table-sort-button";
import { errorToast, successToast } from "@/lib/toasts";
import { RoleSelectDialog } from "@/components/dialogs/role-select-dialog";

type DropDownMenuProps = {
  row: Row<Employee>;
  roles: Role[];
};

// need mechanism for table updates, either lazily reload all data or update in place with expected / returned value from call

/**
 * Component to create a table to render all employees in the database.
 * @group React Components
 */
export default function EmployeeTable({
  data,
  roles,
  loading,
}: {
  data: Employee[];
  roles: Role[];
  loading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEmployeeRoleModal, setShowEmployeeRoleModal] = useState(false);
  const [showEmployeeEditModal, setShowEmployeeEditModal] = useState(false); // this is a bit lazy, someone else can fix it if we have time
  const [showRoleModal, setShowRoleModal] = useState(false);

  const { role } = useAuth();

  // SEND request for employee creation
  async function submitEmployeeInvite(data: any) {
    const res = await fetch("/api/admin/employee/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowEmployeeModal(false);
      successToast(`Employee ${data.Name} was invited!`);
    } else {
      errorToast("Failed to invite employee.");
      console.error(await res.json());
    }
  }

  // SEND request for employee update
  async function submitEmployeeUpdate(data: any) {
    const res = await fetch("/api/admin/employee", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowEmployeeModal(false);
      successToast(`Employee ${data.Name} was updated!`);
    } else {
      errorToast("Failed to update employee.");
      console.error(await res.json());
    }
  }

  // SEND request for employee deletion
  async function submitEmployeeDeletion(data: any) {
    const res = await fetch("/api/admin/employee", {
      method: "DELETE",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      successToast(`Employee ${data.Name} was deleted!`);
    } else {
      errorToast("Failed to update employee.");
      console.error(await res.json());
    }
  }

  async function submitNewRole(data: RoleInsert) {
    const res = await fetch("/api/admin/role/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowRoleModal(false);
    } else {
      errorToast("Failed to create new role.");
      console.error(await res.json());
    }
  }

  function DropDownMenu({ row, roles }: DropDownMenuProps) {
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(employee?.EmployeeNumber ?? "")
              }
            >
              Copy Employee Number
            </DropdownMenuItem>
            {role?.EmployeePermission && (
              <>
                <DropdownMenuItem
                  onClick={() => setShowEmployeeEditModal(true)}
                >
                  <span>Show Employee</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowEmployeeRoleModal(true)}
                >
                  <span>Change Role</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => submitEmployeeDeletion({ id: employee?.id })}
                >
                  <span>Delete Employee</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>

          <FormModal
            title={"Employee"}
            onSubmit={submitEmployeeUpdate}
            showDialog={showEmployeeEditModal}
            setShowDialog={setShowEmployeeEditModal}
          >
            <EmployeeSelectDialog employee={employee} roles={roles} />
          </FormModal>
          <FormModal
            title={"Employee"}
            onSubmit={submitEmployeeUpdate}
            showDialog={showEmployeeRoleModal}
            setShowDialog={setShowEmployeeRoleModal}
          >
            <RoleSelectDialog employee={employee} roles={roles} />
          </FormModal>
        </DropdownMenu>
      </>
    );
  }

  const columns: ColumnDef<Employee, any>[] = [
    {
      accessorKey: "EmployeeNumber",
      header: ({ column }) => <TableSortButton column={column} />,
    },
    {
      accessorKey: "Name",
      header: ({ column }) => <TableSortButton column={column} />,
    },
    {
      accessorKey: "Email",
      header: ({ column }) => <TableSortButton column={column} />,
    },
    {
      accessorKey: "Role",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) =>
        roles.find((role) => role.id === row.original.Role)?.RoleName,
    },
    {
      id: "actions",
      cell: ({ row }) => <DropDownMenu row={row} roles={roles} />,
    },
  ];

  const table: import("@tanstack/table-core").Table<Employee> = useReactTable({
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
      columnFilters,
    },
  });

  return (
    // maybe can use provider here to pass less components around?
    <DataTable table={table} loading={loading}>
      <TableFilter
        table={table}
        initial={"Name"}
        placeholder={"Filter employees..."}
      />
      {role?.EmployeePermission && (
        <>
          <div className="flex items-center space-x-2 w-full">
            <Button
              size="sm"
              variant="outline"
              className="ml-auto hidden h-8 lg:flex"
              onClick={() => setShowRoleModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto hidden h-8 lg:flex"
              onClick={() => setShowEmployeeModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
          <FormModal
            title={"Register Employee"}
            showDialog={showEmployeeModal}
            setShowDialog={setShowEmployeeModal}
            onSubmit={submitEmployeeInvite}
          >
            <EmployeeSelectDialog roles={roles} variant={"invite"} />
          </FormModal>
          <FormModal
            title={"Create Role"}
            showDialog={showRoleModal}
            setShowDialog={setShowRoleModal}
            onSubmit={submitNewRole}
          >
            <CreateRoleDialog />
          </FormModal>
        </>
      )}
    </DataTable>
  );
}
