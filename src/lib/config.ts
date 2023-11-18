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
            href: "/sales",
        },
        {
            title: "Tasks",
            href: "/tasks",
        },
        {
            title: "Settings",
            href: "/settings",
        },
        {
            title: "Test",
            href: "/test/database",
        },
    ],
}



export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Tasks",
            href: "/tasks",
        },
        {
            title: "Sales",
            href: "/sales",
        },
        {
            title: "Training",
            href: "/Training",
        },
    ],
}
