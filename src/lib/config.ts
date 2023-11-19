import { MainNavItem  } from "@/lib/types"

export type DocsConfig = {
    mainNav: MainNavItem[]
}

export const docsConfigAdmin: DocsConfig = {
    mainNav: [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
        },
        {
            title: "Sales",
            href: "/admin/sales",
        },
        {
            title: "Tasks",
            href: "/admin/tasks",
        },
        {
            title: "Settings",
            href: "/admin/settings",
        },
        {
            title: "Training",
            href: "/training",
        },
        {
            title: "Test",
            href: "/admin/test/database",
        },
    ],
}



export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Tasks",
            href: "/employee/tasks",
        },
        {
            title: "Sales",
            href: "/employee/sales",
        },
        {
            title: "Training",
            href: "/training",
        },
    ],
}
