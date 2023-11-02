import { cookies } from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";

/** This route handler will verify that the user trying to create an employee is authorized to do so, then it will
 *  create the employee provided all the required fields were entered correctly.
 *  @param {NextRequest} request
 *  @group Next.js Routes
 */
export async function POST(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const cookieStore = cookies()
    const supabase =
        getSupabaseRouteHandlerClient(cookieStore);

    /* TODO NEED TO VERIFY THAT LOGGED-IN USER IS ALLOWED TO CREATE AN EMPLOYEE */
    /* Otherwise if we are allowing users to self-enroll, we need some admin tasks and a default user role of no perms? */
    await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${requestUrl.origin}/auth/callback`,
            /* add details about the employee registered as additional data on the user entry to pass to db,
                then use a postgresql function to create the employee entry.
             */
        },
    });
    return NextResponse.redirect(requestUrl.origin, {
        status: 301,
    })
}
