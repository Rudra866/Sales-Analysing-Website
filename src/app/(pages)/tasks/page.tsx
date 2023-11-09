'use client'
import React, {useEffect} from 'react';
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {getAllTasks, Task} from "@/lib/database";

function Page() {
    const [tasks, setTasks] = React.useState<Task[]>();
    const supabase = getSupabaseBrowserClient()

    useEffect(() => {
        const t = getAllTasks(supabase).then((res) => {
            console.log('tasks: ', res)
            res && setTasks(res)
        })


    }, []);

    return (
        <div className={'container border rounded'}>
            tasks
            <ScrollArea>
                <div>

                </div>
                <ScrollBar />
            </ScrollArea>
        </div>
    );
}

export default Page;
