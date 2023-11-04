import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"

/** @ignore */
export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

/** @ignore */
export const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
})
