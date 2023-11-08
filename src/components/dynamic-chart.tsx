"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import React, {useEffect, useState} from "react";
import {groupByMonth} from "@/lib/utils";
import {DateRange} from "react-day-picker";
import {subDays} from "date-fns";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Overview} from "@/app/(pages)/dashboard/components/overview";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon} from "@radix-ui/react-icons";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


interface DynamicChartProps {
    title: string
    color?: string
    data: any[]
    category: string[]
    date: DateRange | undefined
}

export function DynamicChart({ title, color, data, category, date }: DynamicChartProps) {

    const [keyValues, setKeyValues] = useState<{ key: string; value: number }[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>(category[0]);
    const [grouping, setGrouping] = useState<string>("month");

    function groupBySelect(){

    }



    useEffect(() => {
        setKeyValues(
            Object.entries(groupByMonth(data || [])).map(([key, value]) => ({
                key: key,
                value: value,
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
        } catch (e) {
            console.log(e)
        } return null
    }

    return (
        <Card className="col-span-4">
            <CardHeader className={'flex flex-row justify-between gap-2'}>
                <CardTitle className={'w-full self-center'}>{title}</CardTitle>
                <Select defaultValue="month">
                    <SelectTrigger id="area"  >
                        <SelectValue placeholder="month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily" onSelect={() => {setGrouping("daily")}
                        }>Daily</SelectItem>
                        <SelectItem value="month" onSelect={() => {setGrouping("month")}}
                        >Month</SelectItem>
                        <SelectItem value="annual" onSelect={() => {setGrouping("annual")}}
                        >Annual</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue={category[0]} >
                    <SelectTrigger id="area" >
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                        {category.map((cat, index) => {
                            return (
                                <SelectItem key={index} value={cat}>
                                    {cat}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={keyValues}>
                        <XAxis
                            dataKey="key"
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
                        <Bar dataKey="value" fill={color || "#adfa1d"} radius={[4, 4, 0, 0]}/>
                        <Tooltip
                            content={customToolTip}
                            cursor={{fill: 'rgba(250,250,250,0.3)', radius: 4}}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardDescription>Monthly sales</CardDescription>
        </Card>

    )
}
