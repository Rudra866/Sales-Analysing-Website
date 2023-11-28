'use client'

import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import {Employee, getEmployeeById, getRoleFromEmployee, getSupabaseBrowserClient, Role} from "@/lib/database";
import {errorToast} from "@/lib/toasts";
import dynamic from "next/dynamic";

const UserForm = dynamic(() => import('../../../components/user-form'));

function Page() {
    const params = useParams()
    const supabase = getSupabaseBrowserClient();
    const [employee, setEmployee] = useState<Employee>()
    const [role, setRole] = useState<Role>()


    useEffect(() => {
        getEmployeeById(supabase, params?.id as string) // love type casting....
            .then(res=> {
                setEmployee(res as Employee)
                return res
            })
            .then(res=> {
                res && getRoleFromEmployee(supabase, res).then(res=> {
                    setRole(res as Role)
                })
            })
            .catch((err) => {
                errorToast("Failed to get data.");
                console.error(err);
            })

    }, [params?.id, supabase]);

    return (
        <div>
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
