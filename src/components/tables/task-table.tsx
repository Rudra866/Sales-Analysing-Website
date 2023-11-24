'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Employee,
    getSupabaseBrowserClient,
    Task,
    TaskInsert,
    getAllEmployees
} from "@/lib/database";
import {ArrowUpDown, MoreHorizontal, Plus} from "lucide-react";
import {format} from "date-fns";
import DataTable, {TableFilter} from "@/components/tables/DataTable";
import FormModal from "@/components/dialogs/FormModal";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Employee, Task, TaskInsert } from "@/lib/database";
import { MoreHorizontal, Plus } from "lucide-react";
import { format } from "date-fns";
import DataTable, {
  DataTableChildProps,
  TableFilter,
} from "@/components/tables/data-table";
import FormModal from "@/components/dialogs/form-modal";
import TableSortButton from "@/components/tables/table-sort-button";
import {toast} from "@/components/ui/use-toast";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { TaskCreateDialog } from "@/components/dialogs/task-create-dialog";
import tableTooltip from "@/components/table-tooltip";

type TaskTableProps = DataTableChildProps<Task> & {
  employees: Employee[];
};

/**
 * Component used to render tasks table
 * @group React Components
 */
export default function TaskTable({
  data,
  employees,
  loading,
}: TaskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showTaskCreateModal, setShowTaskCreateModal] =
    useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const statuses = [
    {
      value: "BACKLOG",
      label: "Backlog",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: "TODO",
      label: "Todo",
      icon: CircleIcon,
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      icon: StopwatchIcon,
    },
    {
      value: "FINISHED",
      label: "Done",
      icon: CheckCircledIcon,
    },
    {
      value: "CANCELLED",
      label: "Canceled",
      icon: CrossCircledIcon,
    },
  ];

  async function createNewTask(data: TaskInsert) {
    await fetch(`/api/task`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "Creator",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) =>
        employees.find((employee) => row.original.Creator === employee.id)
          ?.Name,
    },
    {
      accessorKey: "Assignee",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) =>
        employees.find((employee) => row.original.Assignee === employee.id)
          ?.Name,
    },
    {
      accessorKey: "Name",
      header: ({ column }) => <TableSortButton column={column} />,
    },
    {
      accessorKey: "Description",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ml-1">
            <span className="max-w-[200px] truncate font-medium">
              {tableTooltip(row.original.Description || "No Description")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Status",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("Status"),
        );

                if (!status) {
                    return null
                }

                return (
                    <div className="flex w-[100px] items-center">
                        {status.icon && (
                            <status.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                        )}
                        <span>{status.label}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            }
        },
        {
            accessorKey: "StartDate",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => (format(new Date(row.getValue("StartDate")), "LLL dd, y"))
        },
        {
            accessorKey: "EndDate",
            header: ({column}) => <TableSortButton column={column}/>,
            cell: ({row}) => (format(new Date(row.getValue("EndDate")), "LLL dd, y"))
        },
        {
            id: "actions",
            cell: ({row}) => {
                return (
                    <Button variant="ghost" className="h-8 w-8 p-0"
                    onClick={() => {
                        console.log('setting task: ', row.original)
                        setTask(row.original)
                        setShowTaskCreateModal(true)
                    }}
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                )
            },
        },
    ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    enableSorting: true,
    enableColumnFilters: true,
  });

    return (
        <DataTable table={table} loading={loading}>
            <TableFilter table={table} initial={"Name"} placeholder={"Filter tasks..."}/>
            <div className="flex items-center space-x-2 w-full">
                <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto hidden h-8 lg:flex"
                    onClick={() => setShowTaskCreateModal(true)} // todo post
                >
                    <Plus className="mr-2 h-4 w-4"/>
                    Create Task
                </Button>
            </div>
            <FormModal title={"Create Task"}
                       showDialog={showTaskCreateModal}
                       setShowDialog={setShowTaskCreateModal}
                       onSubmit={createNewTask}>
                <TaskCreateDialog employees={employees} task={task}/>
            </FormModal>
        </DataTable>

    )
}
