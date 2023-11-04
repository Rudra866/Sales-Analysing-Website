import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";

/* currently unused -- need to look into auth.admin email option? */
/**
 * Handles new user email confirmation/login.
 * @param request
 * @group Next.js Routes
 */
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const cookieStore = cookies();
        const supabase =
            getSupabaseRouteHandlerClient(cookieStore);
        await supabase.auth.exchangeCodeForSession(code);
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin);
}
