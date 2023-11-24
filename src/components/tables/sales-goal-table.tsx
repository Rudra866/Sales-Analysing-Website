'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import {useState} from "react";
import {
  Employee, SalesGoal, SalesGoalInsert, MonthlySale, getSupabaseBrowserClient
} from "@/lib/database";
import DataTable, {DataTableChildProps, TableFilter} from "@/components/tables/data-table";
import TableSortButton from "@/components/tables/table-sort-button";
import {toast} from "@/components/ui/use-toast";
import {Plus} from "lucide-react";
import {isAdmin} from "@/lib/utils";
import useAuth from "@/hooks/use-auth";
import {TaskCreateDialog} from "@/components/dialogs/TaskCreateDialog";

export type SalesGoalTableProps = DataTableChildProps<SalesGoal> & {
  employees: Employee[]
  monthlySales: MonthlySale[]
}

export default function SalesGoalTable({data, monthlySales, employees, loading}: SalesGoalTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [goals, setGoals] = useState<SalesGoal[]>([])
  const supabase = getSupabaseBrowserClient();
  const [showTaskCreateModal, setShowTaskCreateModal] = useState<boolean>(false)

  // const [employees, setEmployees] = useState<Employee[]>([])
  // const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([])
  const {employee} = useAuth();
  const [showGoalCreateModal, setShowGoalCreateModal] = useState<boolean>(false)

  async function createNewSaleGoal(data: SalesGoalInsert) {
    await fetch(`/api/goal`, {
      method: "POST",
      body: JSON.stringify(data)
    })
  }

  const columns: ColumnDef<SalesGoal>[] = [
    {
      accessorKey: "Creator",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) => employees.find((employee) =>
          row.original.Creator === employee.id )?.Name,
    },
    {
      accessorKey: "Name",
      header: ({column}) => <TableSortButton column={column}/>,
    },
    {
      accessorKey: "Description",
      header: ({column}) => <TableSortButton column={column}/>,
      // cell: ({row}) => flexRender(row.original.Description, row.getVisibleCells()[0])
      cell: ({row}) => {
        return (
            <div className="flex flex-col">
                <div className="text-sm truncate max-w-xl">{row.original.Description}</div>
            </div>
        )
      }
    },
    {
      accessorKey: "StartDate",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) =>
          (new Date(row.getValue("StartDate"))
              .toLocaleString('en-US', { month: 'long', year: 'numeric' }))
    },
    {
      accessorKey: "TotalGoal",
      header: ({column}) => <TableSortButton column={column}/>,
    },
    {
      accessorKey: "ActualSales",
      header: ({column}) => <TableSortButton column={column}/>,
      cell: ({row}) =>
          monthlySales.find((monthly) =>
              monthly.TimePeriod === row.original.StartDate)?.Total
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
      columnFilters
    },
    enableSorting: true,
    enableColumnFilters: true,
  })


  return (
      <DataTable table={table} loading={loading}>
        <TableFilter table={table} initial={"Name"} placeholder={"Filter goals..."}/>
      </DataTable>

  )
}
