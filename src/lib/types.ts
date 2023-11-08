import { Icons } from "@/components/icons"
import {z} from "zod";
import { PostgrestError } from '@supabase/supabase-js'

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError


export interface NavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
}

export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export const existingEmployeeFormSchema = z.object({
    EmployeeNumber:
        z.string().min(1, {
            message: "EmployeeNumber must not be empty."})
            .max(255, {
                message: "EmployeeNumber must be shorter than 255 characters."}),

    Name:
        z.string()
            .min(1, {
                message: "Employee Name must not be empty."})
            .max(255, {
                message: "Employee Name must be less than 255 characters."}),

    email:
        z.string()
            .min(1, {
                message: "Employee Email must not be empty."})
            .max(320, {
                message: "Employee Email must be less than 255 characters."})
            .email({
                message: "Employee Email must be a valid email address."}),

    // password: z.string(),

    Role:
        z.string().refine(
            (value) => {
                return !isNaN(Number(value)) && Number(value) >= 1
            }, {
                message: "Invalid."
            }
        )
})

export const forgotPasswordDialogSchema = z.object({
    email: z.string().min(1, "Email must not be empty")
        .max(255, "Email exceeds maximum length")
        .email("Only enter a valid email address")
})



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
    Employees: {
        Name: string | null;
        Email: string | null;
        EmployeeNumber: string;
        Role: number; // This should reference to the 'Roles' table
    };
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
