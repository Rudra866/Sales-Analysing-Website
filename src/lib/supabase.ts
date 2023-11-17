import { createClient } from '@supabase/supabase-js'
import {Database} from "@/lib/database.types";
import {CookieOptions, createBrowserClient, createServerClient} from "@supabase/ssr";
import {NextRequest, NextResponse} from "next/server";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) { /* istanbul ignore next */
  throw new Error("Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Create a supabase client for use on a client side component.
 * @group Supabase Clients
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Create a supabase client for use on a server side component.
 * @group Supabase Clients
 */
export function getSupabaseServerClient(cookies: ReadonlyRequestCookies) {
  return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies.get(name)?.value
          },
        },
      }
  )
}

/**
 * Create a supabase client for use in the middleware.
 * @group Supabase Clients
 */
export function getSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
  )
}

/**
 * Create a supabase client for use in a route handler.
 * @group Supabase Clients
 */
export function getSupabaseRouteHandlerClient(cookies: ReadonlyRequestCookies, key?:string) {
  return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookies.set({ name, value: '', ...options })
          },
        },
      }
  )
}


/**
 * Create a supabase client for use on a server action. Server actions are still disabled in the config.
 * Don't use it.
 * @group Supabase Clients
 */
export function getSupabaseServerActionClient(cookies: ReadonlyRequestCookies) {
  return getSupabaseRouteHandlerClient(cookies);
}

