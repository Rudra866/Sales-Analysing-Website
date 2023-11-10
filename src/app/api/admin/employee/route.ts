import {NextResponse} from "next/server";
import {Database, EmployeeUpdate, getSupabaseRouteHandlerClient} from "@/lib/database";
import {cookies} from "next/headers";
import {createClient, SupabaseClient} from "@supabase/supabase-js";

// todo finish setting this up

// get info from users, add extra info from Auth user. We'll use this for extra info for admins.
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const supabase =
      getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY);

  // const userInfo = supabase.auth.admin.getUserById(params.id)
  // for now, just return a call to the database with the employee
  return NextResponse.json(await supabase.from("Employees").select().eq("id", params.id))
}


// modify an employee
// probably going to restrict to doing one of auth/employee change at a time.
export async function PATCH(request: Request) {
  const supabaseAdmin =
      createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  // get id/email as key for the update transaction from query strings


  type ExpectedJSON = {
    email?: string,
    password?: string,
    Name?: string,
    EmployeeNumber?: string
    Role?: number,
  }

  const requestJson: ExpectedJSON = await request.json();

  // handle Auth table attributes first.

  /* hold off for now, should set up a postgres function to handle employee changes directly (write protected) */
  /* as of right now, if we do both it could break an employee if the database fails for some reason */

  // we can add a route shortly to reset the password of an employee.
  // if (requestJson["email"] || requestJson["password"]) {
  //   await supabase.auth.admin.updateUserById(params.id, {
  //     email: requestJson["email"],
  //     password: requestJson["password"]
  //   })
  // }


  // handle Employee table attributes
  const employee: EmployeeUpdate = {
    Email: requestJson.email,
    Name: requestJson.Name,
    EmployeeNumber: requestJson.EmployeeNumber,
    Role: requestJson.Role,
  }

  // const {error, data, status, statusText} = await supabaseAdmin
  //     .from("Employees")
  //     .update(employee)
  //     .eq("id", params.id)
  //     .select()
  //     .maybeSingle();

  // if (error) {
  //   return NextResponse.json({ error }, {status, statusText})
  // }
  //
  // return NextResponse.json({ data: data})
  return NextResponse.json({error: "Not yet implemented."})
}
