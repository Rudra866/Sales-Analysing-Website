'use client'
import {numericSalesFields} from "@/lib/utils";
import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Car} from "lucide-react";
import {cn, groupByMonth, monthlyAverage} from "@/lib/utils";
import {addDays, format} from "date-fns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useDashboard} from "./dashboard-provider";


function counter(arr: string[]) {
    return arr.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
}

export default function SummaryCard({className, defaultCategory = "Total"}: { className?: string, defaultCategory?: string }) {
    const {date , data } = useDashboard()
    const [selectedCategory, setSelectedCategory] = React.useState(defaultCategory);
    const [cardData, setCardData] = React.useState<number>(0);
    const [average, setAverage] = React.useState<number>(0);

    useEffect(() => {
        // sum product of selected category in the data
        const sum = data?.reduce((acc, curr) => {
            // @ts-ignore
            return acc + curr[selectedCategory]
        }, 0)
        if (selectedCategory === "ROI") setCardData((sum ?? 0)/(data?.length ?? 1) * 100) // ROI becomes an avg.
        else setCardData(sum ?? 0)

    }, [data, date, selectedCategory]);

    // useEffect(() => {
    //     const thisMonth = format(new Date(date?.to || new Date()), 'MMM-yy')
    //     const lastMonth = format(new Date(date?.from || new Date()), 'MMM-yy')
    //     const previousMonth = format(addDays(new Date(), -Number(30)), 'MMM-yy')
    //     const e = data && monthlyAverage(data, selectedCategory)
    //     setAverage(e && e[thisMonth] ? e[previousMonth] : 0)
    //
    // }, [selectedCategory , data, date])



    // useEffect(() => {
    //     const thisMonth = format(new Date(date?.to || new Date()), 'MMM-yy')
    //     const previousMonth = format(addDays(new Date(date?.to || new Date()), -Number(30)), 'MMM-yy')
    //     const e = data && monthlyAverage(data, selectedCategory)
    //
    //     const thisMonthValue = e && e[thisMonth] ? e[thisMonth] : 0
    //     const previousMonthValue = e && e[previousMonth] ? e[previousMonth] : 0
    //
    //     const percentageChange = ((thisMonthValue - previousMonthValue) / previousMonthValue) * 100
    //     console.log(percentageChange)
    //
    //     setAverage(percentageChange)
    //
    // }, [selectedCategory , data, date])

    return (
        <div className={'h-full'}>
            {data && (
                <Card className={'h-full'}>
                    <CardHeader className={cn("flex flex-row items-center justify-between pb-2 w-full", className)}>
                        <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="area" className={'border-transparent px-0'}>
                                <SelectValue placeholder="Select" className={'text-sm font-medium'}/>
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
                        {/*<DollarSign className="h-4 w-4 text-muted-foreground"/>*/}
                    </CardHeader>
                    <CardContent>
                        {selectedCategory === "ROI" &&
                            <div className="text-2xl font-bold">{`${cardData.toLocaleString()} %`}</div>
                        }
                        {selectedCategory !== "ROI" &&
                            <div className="text-2xl font-bold">{`$${cardData.toLocaleString()}`}</div>
                        }

                        <p className="text-xs text-muted-foreground">
                            {/*{average > 0.0 && <span className={cn('text-[#adfa1d]')}>+{average}% </span>}*/}
                            {/*{average < 0.0 && <span className={cn('text-[#E86825]')}>{average}% </span>}*/}
                            from last
                            <span>
                            {" "}{format(new Date(date?.from || new Date()), 'yyyy-MMM-dd')}
                        </span>
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}






export function CountCard() {
    const {date, data} = useDashboard()
    const [mostSoldVehicle, setMostSoldVehicle] = useState<{
        vehicle: string,
        count: number
    }>();

    useEffect(() => {
        const cars = data?.map((item) => {return item.VehicleMake})
        const carCount = counter(cars ?? [])

        // Check if carCount is not empty before finding the maximum value
        const max = Object.values(carCount).length > 0 ? Math.max(...Object.values(carCount)) : 0;

        const mostSold = Object.keys(carCount).find((key) => {
            return carCount[key] === max;
        });

        setMostSoldVehicle({
            vehicle: mostSold ?? "None",
            count: max
        });

    }, [date, data]);

    return (
        <div>
            <Card className={'h-full'}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={'font-medium text-sm'}> Most Sold Vehicle</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold truncate">{mostSoldVehicle?.vehicle}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className={cn('text-[#adfa1d] font-bold')}>{mostSoldVehicle?.count} total vehicles</span>
                        <span>
                            {" "}{format(new Date(date?.from || new Date()), 'MMM-dd-yyyy')}
                        </span>
                        {" "}to
                        <span>
                            {" "}{format(new Date(date?.to || new Date()), 'MMM-dd-yyyy')}
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
