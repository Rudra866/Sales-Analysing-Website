import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'
import {getEmployeeFromAuthUser, getRoleFromEmployee} from "@/lib/database";
//
//
// const admin_routes:string[] = [
//     "/admin/employees",
// ]
//
// const database_routes:string[] = [
//
// ]
//
export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
//     const supabase =
//         createMiddlewareClient<Database>({ req, res })
//
//
//     // Send all unauthenticated users to the login page.
//     const {data: { session}}  = await supabase.auth.getSession()
//     if ((!session || !session.user) && req.nextUrl.pathname !== "/authentication") {
//         return NextResponse.redirect(new URL("/authentication", req.url))
//     }
//
//     if (session) {
//         const {data: employee} = await getEmployeeFromAuthUser(supabase, session?.user);
//         const {data: role} = await getRoleFromEmployee(supabase, employee);
//         // if no role at this point, user is set up incorrectly or db failed.
//         if (!role) {
//             return NextResponse.redirect(new URL("/authentication", req.url))
//         }
//
//         // don't allow logged-in users back to the sign-in page
//         if (req.nextUrl.pathname === "/authentication") {
//             return NextResponse.redirect(new URL("/dashboard", req.url))
//         }
//
//         if (!role.EmployeePermission && admin_routes.includes(req.nextUrl.pathname)) {
//             return NextResponse.redirect(new URL("/unauthorized", req.url))
//         }
//
//         if (req.nextUrl.pathname in database_routes && !role.DatabasePermission) {
//             return NextResponse.redirect(new URL("/unauthorized", req.url))
//         }
//     }
//
    return res
}
//
// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
// }
