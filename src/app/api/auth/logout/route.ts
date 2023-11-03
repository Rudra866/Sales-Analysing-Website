import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";

/**
 * This route handler will have the signed-in user log out.
 * @param request
 * @group Next.js Routes
 */
export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const cookieStore = cookies()
    const supabase =
        getSupabaseRouteHandlerClient(cookieStore);

    await supabase.auth.signOut()

    return NextResponse.redirect(`${requestUrl.origin}/authentication`, {
        status: 301,
    })
}
