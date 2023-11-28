"use client";

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
import React, { useState } from "react";
import {
  Employee,
  SalesGoal,
  SalesGoalInsert,
  MonthlySale,
} from "@/lib/database";
import DataTable, {
  DataTableChildProps,
  TableFilter,
} from "@/components/tables/data-table";
import TableSortButton from "@/components/tables/table-sort-button";
import {Plus} from "lucide-react";
import {errorToast, successToast} from "@/lib/toasts";
import {Button} from "@/components/ui/button";
import FormModal from "@/components/dialogs/form-modal";
import GoalCreateDialog from "@/components/dialogs/goal-create-dialog";

export type SalesGoalTableProps = DataTableChildProps<SalesGoal> & {
  employees: Employee[];
  monthlySales: MonthlySale[];
};

export default function SalesGoalTable({
  data,
  monthlySales,
  employees,
  loading,
}: SalesGoalTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showGoalCreateModal, setShowGoalCreateModal] =
    useState<boolean>(false);

  async function createNewSaleGoal(data: SalesGoalInsert) {
    const res = await fetch(`/api/goal`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      successToast("Added/Edited sale goal!");
      setShowGoalCreateModal(false);
    } else {
      errorToast("Failed to update sale goal!");
    }
  }

  const columns: ColumnDef<SalesGoal>[] = [
    {
      accessorKey: "Creator",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) =>
        employees.find((employee) => row.original.Creator === employee.id)
          ?.Name,
    },
    {
      accessorKey: "Name",
      header: ({ column }) => <TableSortButton column={column} />,
    },
    {
      accessorKey: "Description",
      header: ({ column }) => <TableSortButton column={column} />,
      // cell: ({row}) => flexRender(row.original.Description, row.getVisibleCells()[0])
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <div className="text-sm truncate max-w-xl">
              {row.original.Description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "StartDate",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) =>
        new Date(row.getValue("StartDate")).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        }),
    },
    {
      accessorKey: "TotalGoal",
      header: ({ column }) => <TableSortButton column={column} />,
    },
    {
      accessorKey: "ActualSales",
      header: ({ column }) => <TableSortButton column={column} />,
      cell: ({ row }) =>
        monthlySales.find(
          (monthly) => monthly.TimePeriod === row.original.StartDate,
        )?.Total,
    },
  ];

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
      <TableFilter
        table={table}
        initial={"Name"}
        placeholder={"Filter goals..."}
      />
      <div className="flex items-center space-x-2 w-full">
        <Button
          size="sm"
          variant="outline"
          className="ml-auto hidden h-8 lg:flex"
          onClick={() => setShowGoalCreateModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create / Edit Goal
        </Button>
      </div>
      <FormModal
        title="Create Sale Goal"
        onSubmit={createNewSaleGoal}
        setShowDialog={setShowGoalCreateModal}
        showDialog={showGoalCreateModal}
      >
        <GoalCreateDialog />
      </FormModal>
    </DataTable>
  );
}
