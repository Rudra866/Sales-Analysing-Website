'use client'

import React, {useEffect, useState} from 'react';
import {Employee, getAllEmployees, getSupabaseBrowserClient, Task} from "@/lib/database";
import {errorToast} from "@/lib/toasts";
import dynamic from "next/dynamic";

const TaskTable = dynamic(() => import("@/components/tables/task-table"))

// currently identical to AdminTasksPage...
function EmployeeTasksPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  const supabase = getSupabaseBrowserClient();
  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch("/api/task", { method: "GET" })
          .then(response => response.json())
          .then(data => data.data),
      getAllEmployees(supabase)
    ])
        .then(([tasks, employees]) => {
          setData(tasks);
          setEmployees(employees);
        })
        .catch(error => {
          errorToast("Failed to load data.")
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [supabase]);

  return (
      <div className={'container md:border md:p-6 lg:p-12 rounded-xl'}>
        <TaskTable  data={data} employees={employees} loading={loading}/>
      </div>
  );
}

export default EmployeeTasksPage;
