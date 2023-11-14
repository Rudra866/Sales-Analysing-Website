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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {
    CheckCircledIcon,
    ChevronLeftIcon,
    ChevronRightIcon, CircleIcon, CrossCircledIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon, QuestionMarkCircledIcon, StopwatchIcon
} from "@radix-ui/react-icons";
import {Checkbox} from "@/components/ui/checkbox";
import {Employee, getSupabaseBrowserClient, Task, getAllTasksByAssignee, Role, SupabaseClient, Database
} from "@/lib/database";
import {ArrowUpDown, Plus} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropDownMenu} from "./drop-down-menu";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DbResult} from "@/lib/types";
import useAuth from "@/hooks/use-auth";
import FormModal from "@/components/FormModal";
import {AddTasksRowDialog} from "./AddTasksRowDialog";

const supabase = getSupabaseBrowserClient();

export const statuses = [
    {
        value: "backlog",
        label: "Backlog",
        icon: QuestionMarkCircledIcon,
    },
    {
        value: "todo",
        label: "Todo",
        icon: CircleIcon,
    },
    {
        value: "in progress",
        label: "In Progress",
        icon: StopwatchIcon,
    },
    {
        value: "done",
        label: "Done",
        icon: CheckCircledIcon,
    },
    {
        value: "canceled",
        label: "Canceled",
        icon: CrossCircledIcon,
    },
]

export default function TasksTable() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const {user, employee } = useAuth();

    useEffect(() => {
        setLoading(true);
        employee && getAllTasksByAssignee(supabase, employee?.id)
            .then((data) => {
                setTasks(data as Task[]);
                setLoading(false);
                // console.log("tasks: ", data)
            });
    }, [supabase]);

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

    function SortButton(name: string, column: Column<Task>) {
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

    const columns: ColumnDef<Task, Employee>[] = [
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
            accessorKey: "Assignee",
            header: ({column}) => SortButton("Name", column),
            cell: ({row}) => {
                return (
                    <div className="flex space-x-2 ml-1">
                        <Badge variant="outline">
                            <span className="max-w-[200px] truncate font-medium">
                                {tooltip(employees.find((employee) => employee.id === row.original.Assignee)?.Name!)}
                            </span>
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "Creator",
            header: ({column}) => SortButton("Creator", column),
            cell: ({row}) => {
                return (
                    <div className="flex space-x-2 ml-1">
                        <Badge variant="outline">
                            <span className="max-w-[200px] truncate font-medium">
                                {tooltip(employees.find((employee) => employee.id === row.original.Creator)?.Name!)}
                            </span>
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "Description",
            header: ({column}) => SortButton("Description", column),
            cell: ({row}) => row.original.Description,
        },
        {
            accessorKey: "Name",
            header: ({column}) => SortButton("Name", column),
            cell: ({row}) => row.original.Name,
        },
        {
            accessorKey: "EndDate",
            header: ({column}) => SortButton("EndDate", column),
            cell: ({row}) => {
                return (
                    <p className={'text-sm min-w-fit'}>
                        {format(new Date(row.original.EndDate || new Date()), "LLL dd, y")}
                    </p>
                )
            },
        },
        {
            accessorKey: "PercentageComplete", // todo: use tags not percentage
            header: ({column}) => SortButton("PercentageComplete", column),
            cell: ({row}) => row.original.PercentageComplete,
        },
        {
            accessorKey: "StartDate",
            header: ({column}) => SortButton("StartDate", column),
            cell: ({row}) => {
                return (
                    <p className={'text-sm min-w-fit'}>
                        {format(new Date(row.original.StartDate || new Date()), "LLL dd, y")}
                    </p>
                )
            },
        },
        {
            id: "actions",
            cell: ({row}) => DropDownMenu({row, tasks, setTasks}),
        },
    ]
    console.log('tasks: ', tasks)
    return (
        tasks && <DataTable defaultData={tasks} columns={columns} loading={loading} />
    )
}


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    defaultData: TData[]
    loading?: boolean
}

export function DataTable<TData, TValue>({defaultData, columns, loading}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [taskModal, setTaskModal] = useState(false);
    const [data, setData] = useState(defaultData);
    // const {employee} = useAuth()

    const ref = React.useRef<HTMLTableSectionElement>(null)
    const pageSizes = [10, 25, 50, 100]

    useEffect(() => {
        setData(defaultData)
        console.log('defaultData: ', defaultData)

    }, [defaultData]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {sorting, columnFilters},
        enableSorting: true,
        enableColumnFilters: true,
    })

    const newTask = {
        Assignee:'',
        Creator: '55d08fc7-6ca7-43ea-8836-0f232fabd073',
        Description: '',
        EndDate: new Date().toDateString(),
        id: 0,
        Name: '',
        PercentageComplete: 0,
        StartDate: new Date().toDateString(),
    }

    function addTask(task: Task) {
        const setFunc = (old: Task[]) => [...old, task];
        setData(setFunc as DbResult<Task[]>);
        table.setSorting([{id: "StartDate", desc: false,}])
        ref.current?.scrollIntoView({behavior: "smooth"})
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Filter Tasks..."
                    value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("Name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                {taskModal &&
                    <FormModal title={"Task"} showDialog={taskModal} setShowDialog={setTaskModal} onSubmit={addTask}>
                        <AddTasksRowDialog task={newTask} />
                    </FormModal>
                }
                <div className="flex items-center space-x-2 w-full">
                    <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto hidden h-8 lg:flex"
                        onClick={() => {setTaskModal(true)}}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </div>
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
                    <TableBody ref={ref}>
                        {data && table.getRowModel().rows?.length? (
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
                                    No result? refresh..?
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {" "}
                    {table.getFilteredRowModel().rows.length} item(s) selected.
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
                                <SelectValue placeholder={table.getState().pagination.pageSize}/>
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizes.map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <DoubleArrowLeftIcon className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeftIcon className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRightIcon className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <DoubleArrowRightIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}



