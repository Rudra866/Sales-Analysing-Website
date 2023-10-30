import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

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
            createRouteHandlerClient<Database>({ cookies: () => cookieStore });
        await supabase.auth.exchangeCodeForSession(code);
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin);
}

/** Alias for Next.js
 *  @ignore
 */
