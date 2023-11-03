import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {getEmployeeFromAuthUser, getRoleFromEmployee} from "@/lib/dbwrap";

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase =
      getSupabaseRouteHandlerClient(cookieStore)
  try {
    const {data: {user}} = await supabase.auth.getUser();
    let employee, role;
    if (user) {
      employee = await getEmployeeFromAuthUser(supabase, user)
      role = await getRoleFromEmployee(supabase, employee);
    }
    return NextResponse.json({
      employee, role
    })


  } catch (e) {
    console.log(e);
  }
}