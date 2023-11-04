import '@/styles/globals.css'
import {fontSans} from "@/lib/fonts";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/providers";
import {AuthProvider} from "@/components/auth-provider";
import Navigation from "@/components/menu/navigation";
import { ReactNode } from "react";


/**
 * Root layout that is rendered on all pages.
 * @param children
 * @group React Layouts
 */
export default function RootLayout({children,}: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
