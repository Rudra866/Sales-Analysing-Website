import {type EmailOtpType} from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {Database, getSupabaseRouteHandlerClient, getSupabaseServerClient, SupabaseClient} from "@/lib/database";

export async function GET(request: Request) {
  const requestUrl  = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const cookieStore = cookies()
    const supabase: SupabaseClient<Database> = getSupabaseRouteHandlerClient(cookieStore)

    const { error: auth, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (auth || !data.session) {
      console.error(auth)
      return;
    }

    const { error } = await supabase.auth.setSession(data.session)
    if (!error) {
      console.log(data)
      return NextResponse.redirect(next)
    }
  }


  // return the user to an error page with some instructions
  // todo make this page for failed user link, on some route
  return NextResponse.redirect(`${requestUrl.origin}/authentication`)
}