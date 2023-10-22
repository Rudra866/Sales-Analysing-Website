import { MainNavItem  } from "@/lib/types"

interface DocsConfig {
    mainNav: MainNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
        },
        {
            title: "Authentication",
            href: "/authentication",
        },
        {
            title: "Cards",
            href: "/cards",
        },
        {
            title: "Forms",
            href: "/forms",
        },
        {
            title: "Music",
            href: "/music",
        },
        {
            title: "Playground",
            href: "/playground",
        },
        {
            title: "Tasks",
            href: "/tasks",
        },
    ],
}
