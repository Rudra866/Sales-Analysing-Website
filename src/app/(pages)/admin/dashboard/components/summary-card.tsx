'use client'

import React, {useEffect} from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {numericSalesFields} from "@/lib/utils";
import {format} from "date-fns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useDashboard} from "./dashboard-provider";




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
        if (selectedCategory === "ROI") setCardData((sum ?? 0)/(data?.length ?? 1) * 100) // ROI becomes an avg.
        else setCardData(sum ?? 0)

    }, [data, date, selectedCategory]);


    return (
        <div>
            {data && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                            since
                            <span>
                            {" "}{format(new Date(date?.from || new Date()), 'yyyy-MM-dd')}
                        </span>
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
