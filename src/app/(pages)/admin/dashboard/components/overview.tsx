"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useDashboard} from "./dashboard-provider";
import {useEffect, useState} from "react";
import {groupByMonth, groupByTimeFrame} from "@/lib/utils";

export function Overview() {

    const {data, date, setDate} = useDashboard()
    const [salesByMonth, setSalesByMonth] = useState<{ name: string; total: number }[]>();

    useEffect(() => {
        setSalesByMonth(
            Object.entries(groupByTimeFrame(data || [], 'MMM-yy')).map(([key, value]) => ({
                name: key,
                total: value,
            })))
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
    )
}
