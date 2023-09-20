import '@/styles/globals.css'
import {fontSans} from "@/lib/fonts";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/providers";


export default function RootLayout({children,}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col text-primary">
                {/*<SiteHeader />*/}
                <div className="flex-1">{children}</div>
                {/*<SiteFooter companyName={siteConfig.name}/>*/}
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
