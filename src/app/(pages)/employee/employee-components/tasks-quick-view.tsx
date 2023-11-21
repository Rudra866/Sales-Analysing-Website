import React from 'react';
import {Task} from "@/lib/database";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon
} from "@radix-ui/react-icons";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {format} from "date-fns";
export const statuses = [
    {
        value: "BACKLOG",
        label: "Backlog",
        icon: QuestionMarkCircledIcon,
    },
    {
        value: "TODO",
        label: "Todo",
        icon: CircleIcon,
    },
    {
        value: "IN_PROGRESS",
        label: "In Progress",
        icon: StopwatchIcon,
    },
    {
        value: "DONE",
        label: "Done",
        icon: CheckCircledIcon,
    },
    {
        value: "CANCELED",
        label: "Canceled",
        icon: CrossCircledIcon,
    },
]


type TasksQuickViewProps = {
    tasks: Task[] | undefined;
}
function TasksQuickView({tasks}: TasksQuickViewProps) {
    function TaskRow({task}: { task: Task }) {
        const status = statuses.find((status) => status.value === task.Status);
        return (
            <div
                className="flex items-center border border-background hover:border-border rounded-lg p-2 cursor-pointer w-full flex-row"
                onClick={() => {
                    console.log("task id: ", task.id)
                }}
            >
                <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{task.Name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[350px]">{task.Description}</p>
                </div>
                <div className='flex flex-col w-full items-end gap-1'>
                    <div className="flex flex-row gap-2 items-end w-fit">
                        <p className="text-sm font-medium leading-none">{status?.label}</p>
                        {status?.icon && <status.icon className="text-sm font-medium leading-none" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{format(new Date(task.StartDate), "LLL dd, y")}</p>
                </div>
            </div>
        )
    }

    return (
        <Tabs defaultValue="Tasks Overview" className="col-span-3 space-y-4 border rounded-xl p-4">
            <TabsList>
                <TabsTrigger value="Tasks Overview">Tasks Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="Tasks Overview" className="space-y-4">
                <ScrollArea className="h-96">
                    <div className="space-y-2 mr-4">
                        {tasks?.map((task) => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                    </div>
                    <ScrollBar/>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}

export default TasksQuickView;
