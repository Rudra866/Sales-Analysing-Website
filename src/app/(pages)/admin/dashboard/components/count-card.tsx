import {useDashboard} from "@/admin/dashboard/components/dashboard-provider";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Car} from "lucide-react";
import {cn} from "@/lib/utils";
import {format} from "date-fns";

function counter(arr: string[]) {
  return arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
}

export default function CountCard() {
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