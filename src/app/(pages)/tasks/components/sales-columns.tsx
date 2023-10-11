'use client'

import {ColumnDef} from "@tanstack/react-table";
import {new_vehicle_sales_type} from "@/lib/types";
import {Checkbox} from "@/components/ui/checkbox";
import {Task} from "@/app/(pages)/tasks/data/schema";
import {DataTableColumnHeader} from "@/app/(pages)/tasks/components/data-table-column-header";
import {labels, priorities, statuses} from "@/app/(pages)/tasks/data/data";
import {Badge} from "@/components/ui/badge";
import {DataTableRowActions} from "@/app/(pages)/tasks/components/data-table-row-actions";


export const sales_columns: ColumnDef<new_vehicle_sales_type>[] = [
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
        accessorKey: "stock_number",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Stock Number"/>
        ),
        cell: ({row}) => <div className="w-[80px]">{row.getValue("stock_number")}</div>,
        enableSorting: false,
        enableHiding: false,
    },

]
