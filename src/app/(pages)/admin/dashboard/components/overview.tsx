"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useDashboard} from "./dashboard-provider";
import React, {useEffect, useState} from "react";
import {groupByTimeFrame} from "@/lib/utils";
import {customTooltip} from "@/components/custom-tooltip";
import {useEffect, useState} from "react";
import {cn, groupByTimeFrame} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";

export function Overview({className}: { className?: string}) {

    const {data, date, setDate} = useDashboard()
    const [salesByMonth, setSalesByMonth] = useState<{ name: string; total: number }[]>();

    useEffect(() => {
        const groupedData = groupByTimeFrame(data ?? [], 'MMM-yy');
        const salesData = Object.entries(groupedData)
            .map(([key, value]) => ({
                name: key,
                total: value,
            })
        );
        setSalesByMonth(salesData);
    }, [data, date]);

    const customToolTip = (props: any) => {
        try {
            if (props.active && props.payload && props.payload.length) {
                return (
                    <div className="bg-muted p-4 rounded-md shadow-md">
                        <p className="text-muted-foreground text-sm">{props.label}</p>
                        <p className="text-muted-foreground text-sm">Total: {`$${Number(props?.payload[0]?.value)?.toLocaleString()}`}</p>
                    </div>
                )
            }
        }  catch (e) {console.log(e)}
        return null
    }

    return (
        <Card className={cn("col-span-3", className)}>
        <CardHeader>
                 <CardTitle>Sales</CardTitle>
             </CardHeader>
            <CardContent className={'max-w-full'}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesByMonth}>
                        <XAxis
                            dataKey="name"
                            stroke={"#888888"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={"#888888"}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                        />
                        <Bar dataKey="total" fill={"#adfa1d"} radius={[4, 4, 0, 0]}/>
                        <Tooltip
                            content={customToolTip}
                            cursor={{fill: 'rgba(250,250,250,0.3)', radius: 4
                            }}/>
                    </BarChart>
                </ResponsiveContainer>
           </CardContent>
         </Card>
    )
}
