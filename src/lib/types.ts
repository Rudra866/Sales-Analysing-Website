import { Icons } from "@/components/icons"
import { PostgrestError } from '@supabase/supabase-js'
import {Employee} from "@/lib/database";
import {
    ArrowDownIcon, ArrowRightIcon, ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon
} from "@radix-ui/react-icons";

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError


export interface MainNavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
}

// unused
/** @ignore */
export const navigationMenu = [
    "Dashboard",
    "Sales Table",
    "Top Products",
    "Settings",
    "Profile",
    "Log Out",
]

export type SaleWithEmployeeAndFinancingType = {
    EmployeeID: string;
    Employees: Employee;
    ActualCashValue: number;
    CustomerID: number;
    DaysInStock: number | null;
    DealerCost: number | null;
    FinancingID: number | null;
    Financing: {
        Method: string;
    };
    FinAndInsurance: number;
    GrossProfit: number;
    LotPack: number | null;
    NewSale: boolean | null;
    ROI: number | null;
    SaleTime: string | null;
    StockNumber: string;
    Total: number;
    TradeInID: number | null;
    VehicleMake: string;
};


export const statuses = [
    {
        value: "BACKLOG",
        label: "Backlog",
        icon: QuestionMarkCircledIcon,
    },
    {
        value: "TODO",
        label: "Todo",
        icon: CircleIcon,
    },
    {
        value: "IN_PROGRESS",
        label: "In Progress",
        icon: StopwatchIcon,
    },
    {
        value: "DONE",
        label: "Done",
        icon: CheckCircledIcon,
    },
    {
        value: "CANCELED",
        label: "Canceled",
        icon: CrossCircledIcon,
    },
]

export const priorities = [
    {
        label: "Low",
        value: "low",
        icon: ArrowDownIcon,
    },
    {
        label: "Medium",
        value: "medium",
        icon: ArrowRightIcon,
    },
    {
        label: "High",
        value: "high",
        icon: ArrowUpIcon,
    },
]

