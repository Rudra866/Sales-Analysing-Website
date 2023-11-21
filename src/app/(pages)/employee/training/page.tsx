'use client'
import useAuth from "@/hooks/use-auth";
import {redirect} from "next/navigation";

function Page() {
    const {role} = useAuth()
    if (role?.EmployeePermission) redirect('/training/create-new')
    else redirect('/training/1')
}

export default Page;
