// this route should handle users creating tasks with their employee ID, and allow editing their own task.
// it should also handle the admin or user with permission to edit or delete any task. tasks can be blocked behind
// read permissions.

// should handle routes /api/task and /api/task/{id}


import {NextResponse} from "next/server";
import {
  Database,
  getEmployeeFromAuthUser,
  getRoleFromEmployee,
  getSupabaseRouteHandlerClient,
  postToTasks, TaskInsert
} from "@/lib/database";
import {cookies} from "next/headers";
import {createClient} from "@supabase/supabase-js";


export function GET(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

// handle new task input to database, only permit users with write access and employeeID matching Creator.
// database response is passed directly back to the caller. All required fields must be present.
export async function POST(request: Request) {
  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {data: {session}} = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: TaskInsert = await request.json();

  if (!role.WritePermission) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401})
  }

  if (requestBody.Creator != employee.id) {
    return NextResponse.json({error: "Invalid body. Cannot create Task with another employee's ID"}, {status: 400})
  }

  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const dbResult = await postToTasks(supabaseAdmin, requestBody)

  return NextResponse.json(dbResult, {status: 201})
}

export function PATCH(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

export function DELETE(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}