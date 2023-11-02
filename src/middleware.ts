import { NextRequest, NextResponse } from 'next/server'
import {getEmployeeFromAuthUser, getRoleFromEmployee} from "@/lib/dbwrap";
import {getSupabaseMiddlewareClient} from "@/lib/supabase";


/**
 * Add routes here that should be restricted to employees with {@link Role | Role.EmployeePermission}.
 * @group Next.js Middleware
 */
export const admin_routes:string[] = [
    "/admin/employees",
    "/api/admin/register"
]

/**
 * Add routes here that should be restricted to employees with {@link Role | Role.DatabasePermission}.
 * @group Next.js Middleware
 */
export const database_routes:string[] = [

]

// todo -- implement server side route handlers
/**
 * Middleware rules will disallow any unauthorized user from accessing routes besides the login page. We can also
 * set up specific routes based on the user's role permissions. Because this verification happens on the server side,
 * it should be used for any pages that (exclusively) grant higher level access. If you want to restrict only certain
 * parts of your page, use server side route handlers along with the Supabase serverside client.
 * @param req incoming NextRequest to route
 * @group Next.js Middleware
 */
export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })
    const supabase = getSupabaseMiddlewareClient(req, res);

    // Send all unauthenticated users to the login page.
    const {data: { session}}  = await supabase.auth.getSession()
    if ((!session || !session.user) && req.nextUrl.pathname !== "/authentication") {
        return NextResponse.redirect(new URL("/authentication", req.url))
    }

    if (session) {
        /* do something about these */
        const employee = await getEmployeeFromAuthUser(supabase, session?.user);
        if (!employee) {
            return NextResponse.redirect(new URL("/authentication", req.url));
        }

        const role = await getRoleFromEmployee(supabase, employee);
        if (!role) {
            return NextResponse.redirect(new URL("/authentication", req.url))
        }

        // don't allow logged-in users back to the sign-in page
        if (req.nextUrl.pathname === "/authentication") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (admin_routes.includes(req.nextUrl.pathname) && !role.EmployeePermission) {
            return NextResponse.rewrite(
                `${req.nextUrl.protocol}//${req.nextUrl.host}/401`,
                {
                    status: 401
                }
            )
        }

        if (database_routes.includes(req.nextUrl.pathname) && !role.DatabasePermission) {
            return NextResponse.rewrite(
                `${req.nextUrl.protocol}//${req.nextUrl.host}/401`,
                {
                    status: 401
                }
            )
        }
    }
    return res
}

/**
 * Specifies which urls to ignore matching. Currently, this includes the routes:
 * - `/_next/static`
 * - `/_next/image`
 * - `/images`
 * @group Next.js Middleware
 */
export const config = {
    matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
}
