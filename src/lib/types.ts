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


export const  use_vehicle_sales_schema = z.object({
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

export type new_vehicle_sales_type = z.infer<typeof new_vehicle_sales_schema>

export const navigationMenu = [
    "Dashboard",
    "Sales Table",
    "Top Products",
    "Settings",
    "Profile",
    "Log Out",
]
