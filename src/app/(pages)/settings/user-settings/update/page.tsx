'use client'

import React, {useEffect} from 'react';
import {Separator} from "@/components/ui/separator";
import {UserForm} from "@/app/(pages)/settings/components/user-form";
import {
    Employee,
    getAllEmployees,
    getAllRoles,
    getEmployeeFromAuthUser,
    getSupabaseBrowserClient, Role
} from "@/lib/database";
import {FormDescription, FormLabel} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import EmployeeAvatar from "@/components/EmployeeAvatar";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";

function UpdateUserPage() {
    const supabase = getSupabaseBrowserClient();
    const [employees, setEmployees] = React.useState<Employee[]>();
    const [roles, setRoles] = React.useState<Role[]>();
    const router = useRouter()

    useEffect(() => {

        getAllEmployees(supabase).then((res) => {
            // sort by Role
            res?.sort((a, b) => {
                return a.Role - b.Role
            })
            setEmployees(res as Employee[])
            return res
        }).then((res) => {
            console.log('employees: ', res)
        }).catch((err) => {
            console.error(err)
        })

        getAllRoles(supabase).then((res) => {
            setRoles(res as Role[])
            return res
        }).then((res) => {
            console.log('roles: ', res)
        }).catch((err) => {
            console.error(err)
        })

    }, []);


    return (
        <div className="space-y-6">
            <div className={'flex flex-row justify-between'}>
                <div className={'w-full'}>
                    <h3 className="text-lg font-medium">Update User</h3>
                    <p className="text-sm text-muted-foreground">Click on a user to update.</p>
                </div>
                <Input placeholder={'Search'}/>
            </div>
            <Separator />
            {employees?.map((employee) => {
                return (
                    <div key={employee.id} className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm cursor-pointer hover:bg-accent"
                    onClick={() => {router.push(`/settings/user-settings/update/${employee.id}`)}}
                    >
                        <div className="space-y-0.5 ">
                            <Label>{employee.Name}</Label>
                            <p className={'text-[0.8rem] text-muted-foreground'}>{employee.Email}</p>
                        </div>
                        <Badge variant={'outline'} className={'font-medium text-sm '}>{
                            roles?.filter((role) => {
                                return role.id === employee.Role})[0].RoleName
                        }</Badge>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <EmployeeAvatar employee={employee}/>
                        </Button>
                    </div>
                )
            })}
        </div>
    );
}

export default UpdateUserPage;
