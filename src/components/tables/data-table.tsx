import React, {PropsWithChildren, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
// import {columns} from "@/app/(pages)/tasks/components/columns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon} from "@radix-ui/react-icons";
import {Input} from "@/components/ui/input";
import LoadingAnimation from "@/components/loading-animation";

export interface DataTableProps<TData> {
  table: import("@tanstack/table-core").Table<TData>
  loading: boolean
}

export type DataTableChildProps<TData> = {
  data: TData[],
  loading: boolean
}

export const tablePageSizes = [10, 25, 50, 100, 250, 1000]

// todo need to refactor the way this works, I don't like it.
/**
 * Component to create a table for whatever table is passed in.
 * Can pass components as children and render them in the header.
 * @group React Components
 */
export default function DataTable<TData>({table, loading, children}:
                              PropsWithChildren<DataTableProps<TData>>) {
  let columns = table.getAllColumns()
  return (
      <div className="space-y-4">
        <div className="flex items-center">
          {children}
        </div>
        <div>
          <div className="rounded-md border flex-grow">
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
                {!loading && table.getRowModel().rows?.length ? (
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
                        <LoadingAnimation />
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-2 mt-4">
            <div className="flex-1 text-sm text-muted-foreground">
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
                    {tablePageSizes.map((pageSize) => (
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
      </div>
  )
}

export function TableFilter<TData>({table, initial, placeholder}:
                                       {table: import("@tanstack/table-core").Table<TData>,
                                         initial: string, placeholder: string}) {
  const [sortColumn, setSortColumn] = useState(initial)
  return (
      // todo sorting roles doesn't work (ID to string)
      <>
        <Input
            placeholder={placeholder}
            value={(table.getColumn(sortColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(sortColumn)?.setFilterValue(event.target.value)}
            className="max-w-[250px]"
        />
        <span className={"max-w px-2"}>
          <Select onValueChange={setSortColumn}>
            <SelectTrigger>
              <SelectValue placeholder={sortColumn} />
            </SelectTrigger>
            <SelectContent>
              {table.getAllColumns()
                  .map(col=>col.id)
                  .filter(id => !(id === "select" || id === "actions"))
                  .map(columnName => <SelectItem value={columnName} key={columnName}>{columnName}</SelectItem>)}
            </SelectContent>
          </Select>
        </span>
      </>
  )
}
