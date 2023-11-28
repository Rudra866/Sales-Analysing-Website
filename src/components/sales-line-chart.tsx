'use client'

import React, {useEffect, useState} from "react";
import {
    XAxis,
    YAxis,
    Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import {cn, groupSelectionByTimeFrame} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {format} from "date-fns";
import {useDashboard} from "@/admin/dashboard/components/dashboard-provider";
import {useTheme} from "next-themes";

interface SalesLineChartProps {
    className?: string
}

type ChartDataType = {
    date: string
    estimatedSales: number
    actualSales: number
}

export default function SalesLineChart({className}: SalesLineChartProps) {
    const [chartData, setChartData] = useState<ChartDataType[]>();
    const {theme} = useTheme();

    const lineColors = [ theme ==='dark' ? "#ffffff" : "#88888", "#adfa1d"]
    const color1 = `text-[${lineColors[0]}]`
    const color2 = `text-[${lineColors[1]}]`
    const {salesGoal, data, date} = useDashboard();

    const customToolTip = (props: any) => {
        try {
            if (props.active && props.payload && props.payload.length) {
                return (
                    <div className="bg-muted p-4 rounded-md shadow-md">
                        <p className="text-primary text-sm">{props.label}</p>
                        <p className={cn("text-muted-foreground text-sm", color1)}>
                            {props?.payload[1]?.name}{": "}
                            {`$${Number(props?.payload[0]?.value)?.toLocaleString()}`}
                        </p>
                        <p className={cn("text-muted-foreground text-sm", color2)}>
                            {props?.payload[0]?.name}{": "}
                            {`$${Number(props?.payload[1]?.value)?.toLocaleString()}`}
                        </p>
                    </div>
                )
            }
        } catch (e) {
            console.log(e)
        }
        return null
    }

    useEffect(() => {
        if (!data || !salesGoal) {
            return;
        }

        const groupedData = groupSelectionByTimeFrame(data, 'MMM-yy');
        const chartData: ChartDataType[] = Object.keys(groupedData).map((key) => {
            return {
                date: key,
                estimatedSales: groupedData[key].Total,
                actualSales: salesGoal.find
                (goal => format(new Date(goal.StartDate), 'MMM-yy') === key)?.TotalGoal || 0,
            };
        });
        setChartData(chartData);
    }, [data, date, salesGoal]);

    return (
        <Card className={cn("col-span-4 w-full", className)}>
            <CardHeader className={'flex flex-row justify-between gap-2'}>
                <CardTitle className={'w-full self-center'}>Line Chart</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
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
                            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                        />
                        <Line type="monotone" dataKey="actualSales" stroke={lineColors[0]} activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="estimatedSales" stroke={lineColors[1]} activeDot={{r: 8}}/>
                        <Tooltip
                            content={customToolTip}
                            cursor={{fill: 'rgba(250,250,250,0.3)', radius: 4}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
