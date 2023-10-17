import '@/styles/globals.css'
import {fontSans} from "@/lib/fonts";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/providers";
import Navigation from "@/components/navigation";

export default function RootLayout({children,}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Navigation />
            <div className="container flex-1 rounded-[0.5rem]">
                {children}
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
