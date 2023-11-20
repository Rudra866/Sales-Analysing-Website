'use client'
import React, {useEffect, useState} from 'react';
// import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {getAllTasks, Task} from "@/lib/database";
import TaskTable from "@/components/tables/task-table";
// import TasksTable from "@/app/(pages)/tasks/components/TasksTable";

function Page() {
    const [tasks, setTasks] = React.useState<Task[]>();
    const supabase = getSupabaseBrowserClient()

    useEffect(() => {
        const t = getAllTasks(supabase).then((res) => {
            console.log('tasks: ', res)
            res && setTasks(res)
        })
    //      todo literally copy paste sales table

    }, []);



    return (
        <div className={'container'}>
            <TaskTable />
        </div>
    );
}

export default Page;
