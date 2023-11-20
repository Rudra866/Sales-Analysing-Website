import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns";
import {Employee, Sale, Task} from "@/lib/database";
import {DateRange} from "react-day-picker";
import {SaleWithEmployeeAndFinancingType} from "@/lib/types";

/** @ignore */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isAdmin(role: number) {
    const adminRoles = [1, 2, 3, 4, 5];
    return adminRoles.includes(role);
}



export const numericSales = [
    "ActualCashValue",
    "DealerCost",
    "FinAndInsurance",
    "GrossProfit",
    "Holdback",
    "LotPack",
    "ROI",
    "Total",
];

// tmp used at testing pages
export const generateRandomString = (length: number) => [...Array(length)].map(() =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]).join('');

type SaleWithIndex = Sale & {
    [key: string]: any;
};


// grouping by dynamic time frame
export function groupByTimeFrame(data: Sale[], grouping: string): { [p: string]: number } {
    const groupedData: { [key: string]: number } = {};

    data.forEach(item => {
        const date = new Date(
            item.SaleTime?.toString() || ''
        );

        const monthYearKey = format(date, grouping);

        if (!groupedData[monthYearKey]) {
            groupedData[monthYearKey] = 0;
        }

        groupedData[monthYearKey] += item.Total;
    });
    return groupedData;
}

export function groupByMonth(data: Sale[]): { [p: string]: number } {
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

export function filterSalesByEmployee(sales: SaleWithEmployeeAndFinancingType[], employee: Employee | undefined) {
    return sales.filter((sale) => {
        return sale.EmployeeID === employee?.id
    })
}

export function filterSalesByDate(date: DateRange | undefined, sales?: Sale[]) {
    if (!sales) return [];
    return sales.filter((sale) => {
        const saleDate = new Date(sale?.SaleTime?.toString() || '')
        if (date?.from === undefined || date?.to === undefined) return false
        return saleDate >= date?.from && saleDate <= date?.to
    })
}

export function filterTasksByStartDate(tasks?: Task[], date?: DateRange | undefined) {
    if (!tasks) return [];
    return tasks.filter((task) => {
        const taskDate = new Date(task?.StartDate?.toString() || '')
        if (date?.from === undefined || date?.to === undefined) return false
        return taskDate >= date?.from && taskDate <= date?.to
    })
}

export function groupSelectionByTimeFrame(data: (SaleWithIndex | null | undefined)[], grouping: string): { [p: string]: { [p: string]: number } } {
    if (!data) {
        return {};
    }

    return data.reduce((groupedData: { [key: string]: { [p: string]: number } }, item) => {
        if (!item) {
            return groupedData;
        }

        const date = new Date(item.SaleTime?.toString() || '');
        const monthYearKey = format(date, grouping);

        if (!groupedData[monthYearKey]) {
            groupedData[monthYearKey] = {};
        }

        numericSales.forEach((field) => {
            if (!groupedData[monthYearKey][field]) {
                groupedData[monthYearKey][field] = 0;
            }

            const fieldValue = item[field];
            groupedData[monthYearKey][field] += typeof fieldValue === 'number' ? fieldValue : 0;
        });

        return groupedData;
    }, {});
}
