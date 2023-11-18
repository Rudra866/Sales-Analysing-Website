// any user with write permission can create a sale goal?, but they should only
// be able to remove or modify their own goals. this route should allow admins to modify or delete any goal.
// ^ some of this could be handled by RLS, but not if we want read permission to restrict sale goals.

// should handle routes /api/goal and /api/goal/{id}

import {NextResponse} from "next/server";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {cookies} from "next/headers";
import {
  Database,
  getEmployeeFromAuthUser,
  getRoleFromEmployee,
  postToSalesGoals,
  SalesGoalInsert
} from "@/lib/database";
import {createClient} from "@supabase/supabase-js";

export function GET(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

// handle new goal input to database
export async function POST(request: Request) {
  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {data: {session}} = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: SalesGoalInsert = await request.json();

  if (!role.WritePermission) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401})
  }

  if (requestBody.Creator != employee.id) {
    return NextResponse.json({error: "Invalid body. Cannot create sales goal with another employee's ID"}, {status: 400})
  }

  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const dbResult = await postToSalesGoals(supabaseAdmin, requestBody)

  return NextResponse.json(dbResult, {status: 201})
}

export function PATCH(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

export function DELETE(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}