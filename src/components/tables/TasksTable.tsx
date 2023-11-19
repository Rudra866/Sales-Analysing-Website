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
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Employee,
  Tables,
  Sale,
  getSupabaseBrowserClient,
  Task,
  getAllTasks,
  TaskInsert,
  getAllEmployees
} from "@/lib/database";
import {ArrowUpDown, Plus} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropDownMenu} from "@/employee/sales/components/drop-down-menu";
import {format} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DbResult} from "@/lib/types";
import DataTable, {TableFilter} from "@/components/tables/DataTable";
import {RowActionDialog} from "@/employee/sales/components/RowActionDialog";
import FormModal from "@/components/dialogs/FormModal";
import TableSortButton from "@/components/tables/TableSortButton";
import {toast} from "@/components/ui/use-toast";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon
} from "@radix-ui/react-icons";
import useAuth from "@/hooks/use-auth";
import {TaskCreateDialog} from "@/components/dialogs/TaskCreateDialog";

// todo align rows and columns

/**
 * Component used to render sales page table at `/sales`
 * @group React Components
 */
export default function TasksTable() {
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const supabase = getSupabaseBrowserClient();
  const [showTaskCreateModal, setShowTaskCreateModal] = useState<boolean>(false)

  const {employee} = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([])
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
  ]

  async function createNewTask(data: TaskInsert) {
    await fetch(`/api/task`, {
      method: "POST",
      body: JSON.stringify(data)
    })
  }


  useEffect(() => {
    async function getTasks() {
      try {
        const taskResponse = await fetch("/api/task", {method: "GET"})
        const tasks = (await taskResponse.json()).data;
        console.log(tasks)
        const employees = await getAllEmployees(supabase);
        setTasks(tasks);
        setEmployees(employees);
        setLoading(false);
      } catch (e) {
        toast({
          title: "Error!",
          description: "Failed to load Tasks!"
        })
      }
    }
    getTasks()
  }, []);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "Creator",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) => employees.find((employee) => row.original.Creator === employee.id )?.Name,
    },
    {
      accessorKey: "Assignee",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) => employees.find((employee) => row.original.Assignee === employee.id )?.Name,
    },
    {
      accessorKey: "Name",
      header: ({column}) => <TableSortButton column={column}/>,
    },
    {
      accessorKey: "Description",
      header: ({column}) => <TableSortButton column={column}/>,
    },
    {
      accessorKey: "Status",
      header: ({column}) => (
          <TableSortButton column={column}/>
      ),
      cell: ({row}) => {
        const status = statuses.find(
            (status) => status.value === row.getValue("Status")
        )

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
      cell: ({row}) => (new Date(row.getValue("StartDate")).toLocaleDateString())
    },
    {
      accessorKey: "EndDate",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) => (new Date(row.getValue("EndDate")).toLocaleDateString())
    },
  ]

  const table = useReactTable({
    data: tasks,
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
              onClick={() => setShowTaskCreateModal(true)} // todo post
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
        <FormModal title={"Create Task"}
                   showDialog={showTaskCreateModal}
                   setShowDialog={setShowTaskCreateModal}
                   onSubmit={createNewTask}>
          <TaskCreateDialog employees={employees}/>
        </FormModal>
      </DataTable>

  )
}