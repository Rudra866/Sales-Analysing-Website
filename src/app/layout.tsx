import '@/styles/globals.css'
import {fontSans} from "@/lib/fonts";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/providers";
import {AuthContextProvider} from "@/components/auth-provider";
import Navigation from "@/components/menu/navigation";
import { ReactNode } from "react";

import dynamic from 'next/dynamic';
import {Toaster} from "@/components/ui/toaster";
/**
 * Root layout that is rendered on all pages.
 * @param children
 * @group React Layouts
 */
export default function RootLayout({children,}: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <AuthContextProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
