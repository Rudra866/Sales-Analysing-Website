'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Car, DollarSign} from "lucide-react";
import {cn, numericSales} from "@/lib/utils";
import {format} from "date-fns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useDashboard} from "@/app/(pages)/dashboard/components/dashboard-provider";


function counter(arr: string[]) {
    return arr.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
}



export default function SummaryCard({defaultCategory = "Total"}) {
    const {date , data } = useDashboard()
    const [selectedCategory, setSelectedCategory] = React.useState(defaultCategory);
    const [cardData, setCardData] = React.useState<number>(0);

    useEffect(() => {
        // sum product of selected category in the data
        const sum = data?.reduce((acc, curr) => {
            // @ts-ignore
            return acc + curr[selectedCategory]
        }, 0)
        setCardData(sum ?? 0)

    }, [date, selectedCategory]);


    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="area" className={'border-transparent px-0'}>
                            <SelectValue placeholder="Select" className={'text-sm font-medium'}/>
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
                    {/*<DollarSign className="h-4 w-4 text-muted-foreground"/>*/}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{`$${cardData.toLocaleString()}`}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className={cn('text-[#adfa1d]')}>+20.1% </span>
                        from last
                        <span>
                            {" "}{format(new Date(date?.from || new Date()), 'yyyy-MM-dd')}
                        </span>
                    </p>
                </CardContent>
            </Card>
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
        const cars = data?.map((item) => {
            // @ts-ignore
            return item.VehicleMake
        })
        const carCount = counter(cars ?? [])
        const max = Math.max(...Object.values(carCount))
        const mostSold = Object.keys(carCount).find((key) => {
            // @ts-ignore
            return carCount[key] === max
        })
        setMostSoldVehicle({
            vehicle: mostSold ?? "",
            count: max
        })

    }, [date, data]);


    return (
        <div>
            <Card className={'h-full'}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
                    <CardTitle className={'font-medium text-sm'}> Most Sold Vehicle</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold truncate">{mostSoldVehicle?.vehicle}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className={cn('text-[#adfa1d]')}>{mostSoldVehicle?.count} total vehicles</span>
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
