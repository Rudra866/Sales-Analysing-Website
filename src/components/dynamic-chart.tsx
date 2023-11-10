"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";
import React, {useEffect, useState} from "react";
import {cn, numericSales} from "@/lib/utils";
import {DateRange} from "react-day-picker";
import {format} from "date-fns";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Sale} from "@/lib/database";



// todo limit to only these options since  this component is only for sales and can't be used for other data yet.
//           ActualCashValue
//           DaysInStock: number | null
//           DealerCost: number | null
//           FinancingID: number | null
//           FinAndInsurance: number
//           GrossProfit: number
//           Holdback: number | null
//           LotPack: number | null
//           Total: number



function groupByTimeFrame(data: Sale[], grouping: string, field: keyof Sale): { [p: string]: number } {
    return data.reduce((groupedData: { [key: string]: number }, item) => {
        const date = new Date(item.SaleTime?.toString() || '');
        const monthYearKey = format(date, grouping);

        if (!groupedData[monthYearKey]) {
            groupedData[monthYearKey] = 0;
        }

        groupedData[monthYearKey] += item[field] as unknown as number;
        return groupedData;
    }, {});
}

interface DynamicChartProps {
    title: string
    color?: string
    data: Sale[]
    date: DateRange | undefined
    className?: string
}

export function DynamicChart({ title, color, data, date, className }: DynamicChartProps) {

    const [keyValues, setKeyValues] = useState<{ key: string; value: number }[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [categories, setCategories] = useState<string[]>();
    const [grouping, setGrouping] = useState("MMM-yy");


    useEffect(() => {
        if (selectedCategory) {
            setKeyValues(
                Object.entries(groupByTimeFrame(data || [], grouping, selectedCategory as keyof Sale)).map(([key, value]) => ({
                    key: key,
                    value: value,
                }))
            );
        }
    }, [data, date, grouping, selectedCategory]);

    useEffect(() => {

        // get sales columns that are of numeric type
        const numericColumns = data && Object.keys(data[0]).filter((key) => {
            // @ts-ignore
            return typeof data[0][key] === "number" && key !== "id" // todo: fix this
        });
        setCategories(numericColumns)
    }, [data]);

    const customToolTip = (props: any) => {
        try {
            if (props.active && props.payload && props.payload.length) {
                return (
                    <div className="bg-muted p-4 rounded-md shadow-md">
                        <p className="text-primary text-sm">{props.label}</p>
                        <p className="text-primary text-sm">
                            {`$${Number(props?.payload[0]?.value)?.toLocaleString()}`}
                        </p>
                    </div>
                )
            }
        } catch (e) {
            console.log(e)
        } return null
    }

    return (
        <Card className={cn("col-span-4", className)}>
            <CardHeader className={'flex flex-row justify-between gap-2'}>
                <CardTitle className={'w-full self-center'}>{title}</CardTitle>
                <Select defaultValue="MMM-yy" onValueChange={setGrouping}>
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
        </Card>

    )
}
