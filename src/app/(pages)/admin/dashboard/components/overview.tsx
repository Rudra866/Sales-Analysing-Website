"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useDashboard} from "./dashboard-provider";
import React, {useEffect, useState} from "react";
import {groupByTimeFrame} from "@/lib/utils";
import {customTooltip} from "@/components/custom-tooltip";

export default function Overview() {
    const {data, date} = useDashboard()
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

    return (
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
                    content={customTooltip}
                    cursor={{fill: 'rgba(250,250,250,0.3)', radius: 4
                    }}/>
            </BarChart>
        </ResponsiveContainer>
    )
}
