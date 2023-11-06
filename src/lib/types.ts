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

/**
 * @group Zod Schemas
 */
export const  new_vehicle_sales_schema = z.object({
    stock_number: z.number(),
    sales_rep: z.string(),
    fin_mgr: z.string(),
    financing: z.string(),
    customer_name: z.string(),
    city: z.string(),
    vehicle_make: z.string(),
    trade_in: z.string(),
    actual_cash_value: z.number(),
    gross_profit: z.number(),
    gross_profit_MTD: z.number(),
    f_i_gross: z.number(),
    f_i_gross_MTD: z.number(),
    hold_back_MTD: z.number(),
    total: z.number(),
    total_MTD: z.number(),
})

/**
 * @group Zod Schemas
 */
export const use_vehicle_sales_schema = z.object({
    stock_number: z.number(),
    sales_rep: z.string(),
    fin_mgr: z.string(),
    financing: z.string(),
    customer_name: z.string(),
    city: z.string(),
    vehicle_make: z.string(),
    Trade_in: z.string(),
    actual_cash_value: z.number(),
    gross_profit: z.number(),
    gross_profit_MTD: z.number(),
    f_i_gross: z.number(),
    f_i_gross_MTD: z.number(),
    lot_pack: z.number(),
    lot_pack_MTD: z.number(),
    total: z.number(),
    total_MTD: z.number(),
    days_in_stock: z.number(),
    cost: z.number(),
    roi: z.number(),
})

/**
 * @group Zod Schemas
 */
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

export type new_vehicle_sales_type = z.infer<typeof new_vehicle_sales_schema>

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
