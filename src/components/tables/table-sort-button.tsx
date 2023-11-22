import {Column} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import React from "react";

export default function TableSortButton<TData>({column}: {column: Column<TData>}) {
  // todo does not work for employee names
  return (
      <Button
          size="sm"
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {column.id}
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/70" />
      </Button>
  )
}