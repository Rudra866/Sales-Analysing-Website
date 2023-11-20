'use client'
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"
import {CreateRoleDialog} from "@/components/dialogs/CreateRoleDialog";
import FormModal from "@/components/dialogs/FormModal";
import {useState} from "react";
import EmployeeTable from "@/components/tables/EmployeeTable";




export default function SettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Employees Table</h3>
        <p className="text-sm text-muted-foreground w-full">
          Find and manage your employees.
        </p>
      </div>
        <Separator />
        <EmployeeTable />
    </div>
  )
}
