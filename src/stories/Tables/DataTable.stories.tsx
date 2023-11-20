import DataTable, {DataTableProps} from "@/components/tables/DataTable"
import {Meta, StoryObj} from "@storybook/react";
import React, {useState} from "react";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, SortingState,
  useReactTable
} from "@tanstack/react-table";
import {Employee} from "@/lib/database";
import TableSortButton from "@/components/tables/table-sort-button";

const columns: ColumnDef<Employee, any>[] = [
  {
    id: "Column",
    cell: "a"
  },
]

export default {
  title: 'Tables/Data Table',
  component: DataTable,
  render: function Render (args) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([])
    const table: import("@tanstack/table-core").Table<any> = useReactTable({
      data: args.data ?? [],
      columns: args.columns ?? columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting,
        columnFilters
      }
    })
    return (
        <DataTable table={table} loading={args.loading}/>
    )
  },
} as Meta;

// @ts-ignore
export const Empty: StoryObj<typeof DataTable> = {
  args: {
    loading: false,
  },
}

export const Loading: StoryObj<typeof DataTable> = {
  args: {
    loading: true,
  }
}

// todo custom story for this and any other widgets
export const SortButton: StoryObj<DataTableProps<Employee>> = {
  render: () => (
      <TableSortButton column={columns[0] as Column<unknown, unknown>}/>
  ),
  parameters: {
    layout: 'centered',
  }
}
