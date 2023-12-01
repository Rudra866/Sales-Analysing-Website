'use client'

import React, {Suspense} from 'react';
import {useEmployee} from "@/employee/employee-components/employee-provider";
import {Button} from "@/components/ui/button";
import {getSalesCSV} from "@/lib/csv";
import dynamic from "next/dynamic";
import {DynamicChart} from "@/components/dynamic-chart";

const TasksQuickView = dynamic(() => import('@/employee/employee-components/tasks-quick-view'));
const CalendarDateRangePicker = dynamic(() => import(`@/components/date-range-picker`))

export default function EmployeePage() {
    const {
        employee,
        tasks,
        sales,
        date,
        setDate
    } = useEmployee()

    return (
        <Suspense fallback={null}>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <div className="flex flex-col lg:flex-row items-start justify-between space-y-2 lg:space-y-0">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">OverView</h2>
                            <p className="text-muted-foreground">
                                Welcome back, {employee?.Name}
                            </p>
                        </div>
                        <div className="w-fit lg:w-auto flex flex-col lg:flex-row space-y-2 lg:space-x-2 align-top items-end justify-start">
                            <CalendarDateRangePicker date={date} setDate={setDate} />
                            <Button className={'w-full'} onClick={() => getSalesCSV(date)}>Download</Button>
                        </div>
                    </div>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-8">
                        <DynamicChart
                            className="col-span-4"
                            data={sales ?? []}
                            date={date}
                            title={'Sales'}
                        />
                        <TasksQuickView tasks={tasks}/>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
