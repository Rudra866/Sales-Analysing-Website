import { MainNavItem  } from "@/lib/types"

export type DocsConfig = {
    mainNav: MainNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
        },
        {
            title: "Settings",
            href: "/settings",
        },
        {
            title: "Cards",
            href: "/examples/cards",
        },
        {
            title: "Tasks",
            href: "/tasks",
        },
        // example for admin panel
        {
            title: "Admin",
            href: "/admin/employees",
        },
        {
            title: "Sales",
            href: "/sales",
        },
        // temp for dev
        {
            title: "Test",
            href: "/test/database",
        },
    ],
}
