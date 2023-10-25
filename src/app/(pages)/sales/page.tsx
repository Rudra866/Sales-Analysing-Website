import React from 'react';
import SalesTable from "@/app/(pages)/sales/components/SalesTable";
import {DataTable} from "@/app/(pages)/(examples)/tasks/components/data-table";
import {test_columns} from "@/app/(pages)/(examples)/tasks/components/test-column";

function Page() {
    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sales Table.</h2>
                    <p className="text-muted-foreground">
                        Welcome back Jeff!
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/*<UserNav />*/}
                </div>
            </div>
            <SalesTable />
        </div>
    );
}

export default Page;
