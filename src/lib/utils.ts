import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns";
import {Tables} from "@/lib/database";

/** @ignore */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/** remove?
 *  @ignore
 */
export const mediaRatios = {
    video: 16 / 9,
    image: 4 / 3,
    classicFilm: 3 / 2,
    square: 1,
    portrait: 2 / 3,
    instagram: 4 / 5,
    cinema: 21 / 9,
}

export function groupByMonth(data: Tables<"Sales">[]): { [p: string]: number } {
    const groupedData: { [key: string]: number } = {};

    data.forEach(item => {
        const date = new Date(
            item.SaleTime?.toString() || ''
        );

        const monthYearKey = format(date, 'MMM-yy');

        if (!groupedData[monthYearKey]) {
            groupedData[monthYearKey] = 0;
        }

        groupedData[monthYearKey] += item.Total;
    });

    return groupedData;
}
