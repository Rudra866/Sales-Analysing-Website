'use client'

import React, {useEffect, useState} from "react";
import {
    XAxis,
    YAxis,
    Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import {cn, numericSales} from "@/lib/utils";
import {DateRange} from "react-day-picker";
import {getAllSalesGoals, getSupabaseBrowserClient, Sale, SalesGoal} from "@/lib/database";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CheckIcon} from "@radix-ui/react-icons";

interface SalesLineChartProps {
    data: Sale[]
    date: DateRange | undefined
    className?: string
}





export default function SalesLineChart({data, date, className}: SalesLineChartProps) {
    const supabase = getSupabaseBrowserClient();
    const [salesGoals, setSalesGoals] = useState<SalesGoal[]>();
    const lineColors = ["#ffffff", "#82ca9d"]
    const color1 = `text-[${lineColors[0]}]`
    const color2 = `text-[${lineColors[1]}]`






    // todo - make this dynamic based on the data

    // function renderLines () {
    //     dynamic_array = ["android", "ios", "value"];
    //     const lines = dynamic_array.map((value) => (
    //         <Line
    //             key={value}
    //             name={value}
    //             type="monotone"
    //             dataKey={value}
    //             stroke"#ff883c"
    //             strokeWidth={2}
    //         />
    //     ));
    //     return lines;
    // }


    useEffect(() => {
        getAllSalesGoals(supabase).then((res) => {
            console.log("res: ", res)
            setSalesGoals(res as SalesGoal[])
        }).catch((err) => {
            console.error(err)
        })
    }, [])


    const customToolTip = (props: any) => {
        try {
            if (props.active && props.payload && props.payload.length) {
                return (
                    <div className="bg-muted p-4 rounded-md shadow-md">
                        <p className="text-primary text-sm">{props.label}</p>
                        <p className={cn("text-muted-foreground text-sm", color1)}>
                            {props?.payload[0]?.name}{": "}
                            {`$${Number(props?.payload[0]?.value)?.toLocaleString()}`}
                        </p>
                        <p className={cn("text-muted-foreground text-sm", color2)}>
                            {props?.payload[1]?.name}{": "}
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

    // const selectedValues = new Set(column?.getFilterValue() as string[])
    return (
        <Card className={cn("col-span-4", className)}>
            <CardHeader className={'flex flex-row justify-between gap-2'}>
                <CardTitle className={'w-full self-center'}>Line Chart</CardTitle>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full"></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary")}>
                            <CheckIcon className={cn("h-4 w-4")} />
                        </div>
                    </PopoverContent>
                </Popover>

                <Select >
                    <SelectTrigger id="area">
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                        {numericSales?.map((cat, index) => {
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
                        <Line type="monotone" dataKey="estimate" stroke={lineColors[0]} activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="actual" stroke={lineColors[1]}/>
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
