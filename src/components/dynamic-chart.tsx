"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React, {useEffect, useState} from "react";
import {cn, groupSelectionByTimeFrame, numericSalesFields} from "@/lib/utils";
import {DateRange} from "react-day-picker";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Sale} from "@/lib/database";
import {customTooltip} from "@/components/custom-tooltip";


// todo - make this dynamic based on the data as well as dynamic depending on the data type

interface DynamicChartProps {
    title: string
    color?: string
    data: Sale[]
    date: DateRange | undefined
    className?: string
}

// TODO - On hover tooltip it should display more relevant information such as a list of cars that the bar is summing, average ROI, etc..
//  However this would require a complex data structure.


export default function DynamicChart({ title, color, data, date, className }: DynamicChartProps) {
    const [keyValues, setKeyValues] = useState<{ key: string; value: number }[]>();
    const [selectedCategory, setSelectedCategory] = useState("Total");
    const [grouping, setGrouping] = useState("MMM-yy");

    useEffect(() => {
        if (selectedCategory) {
            setKeyValues(
                Object.entries(groupSelectionByTimeFrame(data, grouping)).map(([key, value]) => ({
                    key,
                    value: value[selectedCategory],
                }))
            );
        }
    }, [data, date, grouping, selectedCategory]);

    return (
        <Card className={cn("col-span-4", className)}>
            <CardHeader className={'flex flex-row justify-between gap-2'}>
                <CardTitle className={'w-full self-center'}>{title}</CardTitle>
                <Select defaultValue={grouping} onValueChange={setGrouping}>
                    <SelectTrigger id="area"  >
                        <SelectValue placeholder="Monthly" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MMM-dd">Daily</SelectItem>
                        <SelectItem value="MMM-yy">Monthly</SelectItem>
                        <SelectItem value="yyyy">Annual</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="area" >
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent>
                        {numericSalesFields?.map((cat, index) => {
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
                    <BarChart data={keyValues}
                              margin={{
                                  top: 0,
                                  right: 0,
                                  left: 20,
                                  bottom: 0,
                              }}>
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
                            content={customTooltip}
                            cursor={{fill: 'rgba(250,250,250,0.3)', radius: 4}}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

    )
}
