import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {CookieOptions, createServerClient} from "@supabase/ssr";
import {Database} from "@/lib/database.types";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const cookieStore = cookies()
    const supabase = getSupabaseRouteHandlerClient(cookieStore);

    await supabase.auth.signOut()

    return NextResponse.redirect(`${requestUrl.origin}/login`, {
        status: 301,
    })
}
