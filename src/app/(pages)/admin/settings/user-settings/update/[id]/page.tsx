'use client'

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from "next/navigation";
import {Employee, getEmployeeById, getRoleFromEmployee, getSupabaseBrowserClient, Role} from "@/lib/database";
import {UserForm} from "@/admin/settings/components/user-form";

function Page() {
    const params = useParams()
    const supabase = getSupabaseBrowserClient();
    const [employee, setEmployee] = useState<Employee>()
    const [role, setRole] = useState<Role>()


    useEffect(() => {
        getEmployeeById(supabase, params?.id as string) // love type casting....
            .then(res=> {
                setEmployee(res as Employee)
                console.log(res)
                return res
            }).then(res=> {
                res && getRoleFromEmployee(supabase, res).then(res=> {
                    console.log(res)
                    setRole(res as Role)
                })
            })

    }, []);

    return (
        <div>
            {/*todo connect the role from DB to UI*/}
            {employee && role &&
                <UserForm
                    name={employee.Name}
                    number={employee.EmployeeNumber}
                    email={employee.Email}
                    employee={employee}
                    role={role}
                    remove={true}
                />
            }


        </div>
    );
}

export default Page;
