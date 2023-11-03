import { cookies } from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";
import type {Database} from "@/lib/database.types";
import type {SupabaseClient} from "@supabase/supabase-js";

/**
 * This route will create a new user, along with accompanying Employee in the database.
 *
 *  This route is protected by middleware. Only Role.EmployeePermission can access it.
 *  @param {NextRequest} request
 *  @group Next.js Routes
 */
export async function POST(request: NextRequest) {
  interface ExpectedJSON {
    email:string,
    password:string,
    Name:string,
    EmployeeNumber:string,
    Role:string,
  }

  const cookieStore = cookies()
  const supabase: SupabaseClient<Database> = getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY!);
  const requestUrl = new URL(request.url)
  const data = await request.json() as ExpectedJSON;

  /* Otherwise if we are allowing users to self-enroll, we need some admin tasks and a default user role of no perms? */
  console.log(data.Name)
  const result = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    user_metadata: {
        // Pass Employee attributes to database so trigger can create an employee.
        Name: data.Name,
        EmployeeNumber: data.EmployeeNumber,
        Role: data.Role,
    },

    email_confirm: true, // todo this auto confirms emails. temp?
  });

  // make these return less debug-like info, and integrate into our UIs
  // TODO add more error types
  if (result.error) {
      if (result.error.message === "User already registered") return NextResponse
          .json({error: 'User with that email address is already registered.'}, {status: 500})

      else {
          console.log(result.error)
          return NextResponse
              .json({error: 'An unknown error occured and the user was not created.'}, {status: 500})
      }
  }

  return NextResponse.json(result.data.user)
}
