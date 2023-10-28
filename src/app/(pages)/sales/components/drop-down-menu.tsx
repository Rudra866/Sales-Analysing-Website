'use client'

import {Row} from "@tanstack/react-table";
import {Sale} from "@/lib/database.types";
import React, {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import FormModal from "@/app/(pages)/sales/components/FormModal";
import {AddRowDialog} from "@/app/(pages)/sales/components/AddRowDialog";
import supabase from "@/lib/supabase";


type Props = {
    row: Row<Sale>
    sales: Sale[]
    setSales: (sales: Sale[]) => void
}


export function DropDownMenu({row, sales, setSales}: Props) {
    const [item, setItem] = useState<Sale>();
    const [salesModal, setSalesModal] = useState(false);

    function updateSales(sale: Sale) {
        const originalSales = [...sales]
        const updatedSales = originalSales
            .map((oldSale) => oldSale.id === sale.id ? sale: oldSale)
        setSales(updatedSales)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.EmployeeID.toString())}>
                        Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={
                        () => {
                            setItem(row.original)
                            setSalesModal(true)
                        }
                    }>
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => {
                        row.original.id && supabase.from('Sales').delete().eq('id', row.original.id).then(() => {
                            const originalSales = [...sales]
                            const updatedSales = originalSales.filter((oldSale) => oldSale.id !== row.original.id)
                            setSales(updatedSales)
                        })
                    }}>
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {row.original &&
                <FormModal title={"Sale"} showDialog={salesModal} setShowDialog={setSalesModal}>
                    <AddRowDialog sale={row.original} updateSale={updateSales} setShowDialog={setSalesModal}/>
                </FormModal>
            }
        </>
    );
}
