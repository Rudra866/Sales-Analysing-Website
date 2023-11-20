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
  getAllEmployees, SalesGoal, SalesGoalInsert, MonthlySale, getAllMonthlySales
} from "@/lib/database";
import DataTable, {TableFilter} from "@/components/tables/DataTable";
import TableSortButton from "@/components/tables/table-sort-button";
import {toast} from "@/components/ui/use-toast";


export default function SalesGoalTable() {
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [goals, setGoals] = useState<SalesGoal[]>([])
  const supabase = getSupabaseBrowserClient();
  const [showTaskCreateModal, setShowTaskCreateModal] = useState<boolean>(false)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([])

  async function createNewSaleGoal(data: SalesGoalInsert) {
    await fetch(`/api/goal`, {
      method: "POST",
      body: JSON.stringify(data)
    })
  }


  useEffect(() => {
    async function getSalesGoals() {
      try {
        const response = await fetch("/api/goal", {method: "GET"})
        const goals = (await response.json()).data;
        const employees = await getAllEmployees(supabase);
        const monthlySales = await getAllMonthlySales(supabase);
        setMonthlySales(monthlySales);
        setGoals(goals);
        setEmployees(employees);
        setLoading(false);
      } catch (e) {
        toast({
          title: "Error!",
          description: "Failed to load Tasks!"
        })
      }
    }
    getSalesGoals()
  }, [supabase]);

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
    data: goals,
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
        {/*<div className="flex items-center space-x-2 w-full">*/}
        {/*  <Button*/}
        {/*      size="sm"*/}
        {/*      variant="outline"*/}
        {/*      className="ml-auto hidden h-8 lg:flex"*/}
        {/*      onClick={() => setShowTaskCreateModal(true)} // todo post*/}
        {/*  >*/}
        {/*    <Plus className="mr-2 h-4 w-4" />*/}
        {/*    Create Task*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </DataTable>

  )
}
