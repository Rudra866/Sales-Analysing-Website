'use client'

import React, {useEffect} from 'react';
import {Separator} from "@/components/ui/separator";
import {
    Employee,
    getAllEmployees,
    getAllRoles,
    getEmployeeFromAuthUser,
    getSupabaseBrowserClient, Role
} from "@/lib/database";
import {Button} from "@/components/ui/button";
import EmployeeAvatar from "@/components/EmployeeAvatar";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

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
                {/*todo implement search*/}
                <Input placeholder={'Search'}/>
            </div>
            <Separator/>
            <ScrollArea className={'h-[800px]'}>
                {employees?.map((employee) => {
                    return (
                        <div key={employee.id}
                             className="flex items-center border-b justify-between space-x-4  p-3 shadow-sm cursor-pointer hover:bg-accent mr-4 my-2"
                             onClick={() => {
                                 router.push(`/settings/user-settings/update/${employee.id}`)
                             }}
                        >
                                <div className="flex items-center space-x-4">
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <EmployeeAvatar employee={employee}/>
                                    </Button>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {employee.Name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{employee.Email}</p>
                                    </div>
                                </div>
                            <Badge variant={'outline'}>{
                                roles?.filter((role) => {
                                    return role.id === employee.Role
                                })[0].RoleName
                            }</Badge>
                        </div>
                    )
                })}
                <ScrollBar/>
            </ScrollArea>

        </div>
    );
}

export default UpdateUserPage;
