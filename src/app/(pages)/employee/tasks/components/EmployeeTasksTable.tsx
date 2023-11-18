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
// import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
// import {Checkbox} from "@/components/ui/checkbox";
// import {Employee, Tables, Sale, getSupabaseBrowserClient} from "@/lib/database";
import {ArrowUpDown, Plus} from "lucide-react";
// import {Badge} from "@/components/ui/badge";
import {DropDownMenu} from "./drop-down-menu";
import {format} from "date-fns";
import {useEmployee} from "@/employee/employee-components/employee-provider";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Employee, Tables, Task} from "@/lib/database";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import tableTooltip from "@/components/table-tooltip";
import {Badge} from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import {Input} from "@/components/ui/input";
import FormModal from "@/components/FormModal";
import {RowActionDialog} from "@/employee/tasks/components/RowActionDialog";
// import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
// import {DbResult} from "@/lib/types";
// import DataTable from "@/components/DataTable";
// import {RowActionDialog} from "./RowActionDialog";
// import FormModal from "@/components/FormModal";
// import {useEmployee} from "@/employee/employee-components/employee-provider";

// todo align rows and columns

/**
 * Component used to render sales page table at `/sales`
 * @group React Components
 */
export default function EmployeeTasksTable() {

    const {
        employee,
        tasks,
        sales,
        date,
        setDate
    } = useEmployee()





    async function onSubmit(data:any) {
        console.log('Table onSubmit: ', data)
        // data["TradeInID"] = 12312
        data["Total"] = 5;
        const fake = {
                "StockNumber": "ew",
                "VehicleMake": "43",
                "CustomerName": "4343",
                "ActualCashValue": 0,
                "GrossProfit": 0,
                "FinAndInsurance": 0,
                "UsedSale": true,
                "EmployeeID": "4ff2a2d7-09a1-4d26-81e1-55fcf9b0f49b",
                "LotPack": 0,
                "DaysInStock": 0,
                "DealerCost": 0,
                "ROI": 0,
                "Total": 5,
                "CustomerCity": "Regina"
            }
        console.log('fake: ', fake)
        await fetch(`http://localhost:3000/api/sale`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fake),
        })
    }





        const table = useReactTable({
        data: sales,
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
            <Input
                placeholder="Filter sales..."
                value={(table.getColumn("VehicleMake")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("VehicleMake")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
            <div className="flex items-center space-x-2 w-full">
                <Button
                     size="sm"
                     variant="outline"
                     className="ml-auto hidden h-8 lg:flex"
                     onClick={() => {
                         // const setFunc = (old: Sale[]) => [...old, newRow];
                         // setSales(setFunc as DbResult<Sale[]>);
                         // table.setSorting([{id: "SaleTime", desc: false,}])
                         setShowSaleDialog(true)
                     }}
                >
                 <Plus className="mr-2 h-4 w-4" />
                 Add Row
                </Button>
             </div>
            <FormModal title={"Create Sale"} showDialog={showSaleDialog} setShowDialog={setShowSaleDialog} onSubmit={onSubmit}>
                <RowActionDialog/>
            </FormModal>
        </DataTable>

    )
}
