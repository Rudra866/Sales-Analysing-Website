import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
// import { GeistSans as FontMono, GeistMono as FontSans} from 'geist/font'
export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
})
