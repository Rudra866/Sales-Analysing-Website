'use client'

import React, {useEffect, useState} from 'react';
import TaskTable from "@/components/tables/task-table";

function Page() {
    return (
        <div className={'container'}>
            <TaskTable />
        </div>
    );
}

export default Page;
