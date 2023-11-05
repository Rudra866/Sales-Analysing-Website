import DataTable, {DataTableProps} from "../components/DataTable"
import EmployeeTable from "../components/EmployeeTable"
import {Meta, StoryObj} from "@storybook/react";
import React, {JSX, ReactNode, useState} from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, SortingState,
  useReactTable
} from "@tanstack/react-table";
import {Employee} from "@/lib/database";
import SalesTable from "@/app/(pages)/sales/components/SalesTable";
import TableSortButton from "@/components/TableSortButton";


export default {
  title: 'Data Table',
  component: DataTable,
} as Meta;

// @ts-ignore
export const Loading: StoryObj<DataTableProps<never>> = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
      useState<ColumnFiltersState>([])
  const table: import("@tanstack/table-core").Table<never> = useReactTable({
    data: [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
        sorting,
        columnFilters
    }
  })
  return <DataTable table={table} loading={true}/>
};

// todo modify when we remove data collection from the tables
export const Employees: StoryObj<DataTableProps<Employee>> = {
  render: () => <EmployeeTable/>
}

// todo modify when we remove data collection from the tables
export const Sales: StoryObj<DataTableProps<Employee>> = {
  render: () => <SalesTable/>
}

const columns: ColumnDef<Employee, any>[] = [
  {
    id: "Column",
    cell: "a"
  },
]

// todo custom story for this or no?
export const SortButton: StoryObj<DataTableProps<Employee>> = {
  // @ts-ignore
  render: () => <TableSortButton column={columns[0]}/>
}

SortButton.parameters = {
    layout: 'centered',
}
