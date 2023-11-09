'use client'

import React from "react";
import {
    XAxis,
    YAxis,
    Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";



interface SalesLineChartProps {
    data: {
        date: string,
        actual: number,
        estimate: number
    }[]
}

export default function SalesLineChart({ data }: SalesLineChartProps ) {

    const customToolTip = (props: any) => {
        // console.log(props)
        try {
            if (props.active && props.payload && props.payload.length) {
                return (
                    <div className="bg-muted p-4 rounded-md shadow-md">
                        <p className="text-muted-foreground text-sm">{props.label}</p>
                        <p className="text-muted-foreground text-sm">Total: {`$${Number(props?.payload[0]?.value)?.toLocaleString()}`}</p>
                    </div>
                )
            }
        }  catch (e) {
            console.log(e)
        }
        return null
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <XAxis
                    dataKey="date"
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
                />
                <Line type="monotone" dataKey="estimate" stroke={"#8884d8"} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="actual" stroke={"#82ca9d"} />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
}
