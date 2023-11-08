'use client'

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from "next/navigation";
import {Employee, getEmployeeById, getSupabaseBrowserClient} from "@/lib/database";
import {UserForm} from "@/app/(pages)/settings/components/user-form";

function Page() {
    const params = useParams()
    const supabase = getSupabaseBrowserClient();
    const [employee, setEmployee] = useState<Employee>()


    useEffect(() => {
        getEmployeeById(supabase, params.slug[0]).then(res=> {
            setEmployee(res as Employee)
            }
        )
    }, []);

    return (
        <div>
            <UserForm
                name={employee?.Name}
                number={employee?.EmployeeNumber}
                email={employee?.Email}
                password={employee?.Email}
            />
            <p>{}</p>
        </div>
    );
}

export default Page;
