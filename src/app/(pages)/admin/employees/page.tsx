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
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/database.types"
import {
  ColumnDef, getCoreRowModel, useReactTable, getPaginationRowModel,
  flexRender, SortingState, getSortedRowModel, Column, Row, ColumnFiltersState, getFilteredRowModel
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DialogClose} from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { useForm} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

export interface Employee extends Tables<"Employees"> {}
export interface Role extends Tables<"Roles"> {}

const pageSizes = [10, 25, 50, 100]

function fetchData() {
  return Promise.all([
    supabase.from('Employees').select('*').range(0, 100),
    supabase.from('Roles').select('*').range(0, 100),
  ]);
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  updateCallback: React.Dispatch<React.SetStateAction<boolean>>
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

// export type EmployeeUpdate = Database['public']['Tables']["Employees"]['Update']



const employeeFormSchema = z.object({
  EmployeeNumber:
    z.string().min(1, {
    message: "EmployeeNumber must not be empty."})
    .max(255, {
    message: "EmployeeNumber must be shorter than 255 characters."}),

  Name:
    z.string()
    .min(1, {
    message: "Employee Name must not be empty."})
    .max(255, {
    message: "Employee Name must be less than 255 characters."}),

  Email:
    z.string()
    .min(1, {
      message: "Employee Email must not be empty."})
    .max(320, {
      message: "Employee Email must be less than 255 characters."})
    .email({
      message: "Employee Email must be a valid email address."}),

  Role:
    z.string().refine(
        (value) => {
            return !isNaN(Number(value)) && Number(value) >= 1
        }, {
          message: "Invalid."
        }
    )
})



// TODO
const roleFormSchema = z.object({
  Role:
      z.string().refine(
          (value) => {
            return !isNaN(Number(value)) && Number(value) >= 1
          }, {
            message: "Invalid."
          }
      )
})

interface EmployeeFormProps {
  row: Row<Employee>
  employee?: Employee
  roles: Role[]
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  updateCallback: ()=> void;
}

function EmployeeFormModal({row, roles, showDialog, setShowDialog, updateCallback}: EmployeeFormProps) {
  const [editState, setEditState] = useState(false);
  const employee = row.original;

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      EmployeeNumber: employee?.EmployeeNumber ?? "",
      Name: employee?.Name ?? "",
      Email: employee?.Email ?? "",
      Role: employee?.Role.toString() ?? "",
    },
  })
  async function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    try {
      const { data, error} = await supabase
          .from('Employees')
          .update(values)
          .eq('Email', values.Email)
          .select()
      if (error) {
        console.log("Supabase error: " + error);
        throw new Error("An error occurred while updating the employee record.");
      }
    } catch (error) {
      console.log(error)
    } finally {
      updateCallback();
      setShowDialog(false);
    }
  }
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Employee</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogBody>
              <FormField
                  control={form.control}
                  name="EmployeeNumber"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>EmployeeNumber</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="EmployeeNumber"
                              {...field}
                              disabled={!editState}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Employee Name"
                              {...field}
                              disabled={!editState}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Employee Email"
                              {...field}
                              disabled={!editState}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="Role"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            disabled={!editState}
                            defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Employee Role" {...field} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                                <SelectItem value={role.id.toString()} key={role.id}>
                                  {role.RoleName}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </DialogBody>
            <DialogFooter>
              {editState ? (
                  <Button type={"submit"}>Submit</Button>
              ) : (
                  <Button
                      variant="destructive"
                      type="button"
                      onClick={() =>
                          setTimeout(() => {
                            setEditState(true);
                          }, 10)
                      }
                  >
                    Edit
                  </Button>
              )}
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// TODO
function RoleSelectForm({row, roles, showDialog, setShowDialog, updateCallback}: EmployeeFormProps) {
  const [editState, setEditState] = useState(false);
  const employee = row.original;
  const form = useForm<z.infer<typeof roleFormSchema>>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
          Role: employee?.Role.toString() ?? "",
        }});

  async function onSubmit(values: z.infer<typeof roleFormSchema>) {
    try {
      const { data, error} = await supabase
        .from('Employees')
        .update({Role: values.Role})
        .eq('id', employee.id)
        .select()

      if (error) {
        console.log("Supabase error: ", error);
        throw new Error("An error occurred while updating the employee's role.");
      }

      // for now, update the whole table
      updateCallback();
    } catch (error) {
      console.log(error)
    }
  }

  return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee</DialogTitle>
          </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8">
            <DialogBody>
              <FormField
                  control={form.control}
                  name="Role"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Employee Role" {...field} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                                <SelectItem value={role.id.toString()} key={role.id}>
                                  {role.RoleName}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </DialogBody>
            <DialogFooter>
                <Button type={"submit"} variant={"ghost"}>
                  Change
                </Button>
              <DialogClose>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
        </DialogContent>
      </Dialog>

      );
}


function DropDownMenu(row:Row<Employee>, roles: Role[], updateCallback: ()=> void) {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const employee = row.original;
  return (
    <DropdownMenu>
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
        <DropdownMenuItem onClick={() => setShowEmployeeModal(true)}>
          Show Employee
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=> setShowRoleModal(true)}>
          Change Role
        </DropdownMenuItem>   {/* Pop open modal for role selection/create new role */}
      </DropdownMenuContent>
      <EmployeeFormModal
                      roles={roles}
                      row={row}
                      showDialog={showEmployeeModal}
                      setShowDialog={setShowEmployeeModal}
                      updateCallback={updateCallback}
      />
      <RoleSelectForm roles={roles}
                      row={row}
                      showDialog={showRoleModal}
                      setShowDialog={setShowRoleModal}
                      updateCallback={updateCallback}/>
    </DropdownMenu>);
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [needUpdate, setNeedUpdate] = useState(true);
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
      }
    }

    loadData().then(r => setLoading(false));
    setNeedUpdate(false);
  }, [needUpdate]);

  const updateCallback = () => setNeedUpdate(true);


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
      cell: ({ row }) => DropDownMenu(row, roles, updateCallback),
    },
  ]
  if (loading) {
    // temporary loading skeletons until bill is done with global skeletons
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
    return (
    <>
      <EmployeeTable updateCallback={updateCallback} columns={columns} data={employees}/>
    </>);
  }
}
