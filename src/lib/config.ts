import { MainNavItem  } from "@/lib/types"

interface DocsConfig {
    mainNav: MainNavItem[]
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Contact",
            href: "/contact-us",
        },
        {
            title: "About",
            href: "/about-us",
        },
    ],
}
