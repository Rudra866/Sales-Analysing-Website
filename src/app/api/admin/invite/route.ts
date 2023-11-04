import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";

/**
 * Nearly identical to register, but with inviting the user to join instead.
 * @param request
 * @constructor
 */
export async function POST(request: NextRequest) {
  interface ExpectedJSON {
    email:string,
    Name:string,
    EmployeeNumber:string,
    Role:string,
  }

  const cookieStore = cookies()
  const supabase: SupabaseClient<Database> =
      getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY!);
  const data = await request.json() as ExpectedJSON;

  console.log(data.Name)
  const result = await supabase.auth.admin.inviteUserByEmail(data.email, {
    data: {
      // Pass Employee attributes to database so trigger can create an employee.
      Name: data.Name,
      EmployeeNumber: data.EmployeeNumber,
      Role: data.Role,
    },
  });

  // make these return less debug-like info, and integrate into our UIs
  // TODO add more error types && handle on front end
  // TODO Add checking for reaching email quota.
  if (result.error) {
    if (result.error.message === "User already registered") return NextResponse
        .json({error: 'User with that email address is already registered.'}, {status: 500})

    else {
      console.log(result.error)
      return NextResponse
          .json({error: 'An unknown error occured and the user was not created.'}, {status: 500})
    }
  }

  return NextResponse.json({data: result.data.user})
}