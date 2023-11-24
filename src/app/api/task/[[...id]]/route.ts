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
  postToTasks, TaskInsert, TaskUpdate
} from "@/lib/database";
import {cookies} from "next/headers";
import {createClient} from "@supabase/supabase-js";


export async function GET(request: Request, { params }: {params: {id: string[]}}) {
  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {data: {session}} = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);

  if (!role.ReadPermission) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401})
  }

  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  if (!params.id) { // if querying ALL
    if (role.EmployeePermission) { // get ALL tasks as an admin calling the endpoint
      const dbResult = await supabaseAdmin
          .from("Tasks")
          .select()
      return NextResponse.json(dbResult, {status: dbResult.status});
    }

    else {                       // otherwise, get all for current logged-in user only
      const dbResult = await supabaseAdmin
          .from("Tasks")
          .select()
          .eq("Assignee", employee.id)
      return NextResponse.json(dbResult, {status: dbResult.status});
    }

  } else {
    const dbResult = await supabaseAdmin
        .from("Tasks")
        .select()
        .in("id", params.id)
    return NextResponse.json(dbResult, {status: dbResult.status})
  }
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

export async function PATCH(request: Request, { params }: {params: {id: string[]}}) {
  if (!params.id) {
    NextResponse.json({error: "No task ID provided to modify."}, {status: 400})
  }
  if (params.id.length > 1) {
    NextResponse.json({error: "Multiple IDs provided to modify (only send one)"}, {status: 400})
  }

  const supabase =
      getSupabaseRouteHandlerClient(cookies());
  const {data: {session}} = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: TaskUpdate = await request.json();

  if (!role.ModifySelfPermission || !role.ModifyAllPermission ||
      requestBody.Creator != employee.id && !role.ModifyAllPermission) {
    return NextResponse.json({error: "Forbidden."}, {status: 401})
  }

  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const dbResult = await supabaseAdmin
      .from("Tasks")
      .update(requestBody)
      .eq('id', params.id[0])
      .single();

  return NextResponse.json(dbResult, {status: dbResult.status})
}

export async function DELETE(request: Request, { params }: {params: {id: string[]}}) {
  if (!params.id) {
    NextResponse.json({error: "No task ID provided to delete."}, {status: 400})
  }
  if (params.id.length > 1) {
    NextResponse.json({error: "Multiple IDs provided to delete (only send one)"}, {status: 400})
  }

  const supabase =
      getSupabaseRouteHandlerClient(cookies());
  const {data: {session}} = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: TaskUpdate = await request.json();

  if (!role.ModifySelfPermission || !role.ModifyAllPermission ||
      requestBody.Creator != employee.id && !role.ModifyAllPermission) {
    return NextResponse.json({error: "Forbidden."}, {status: 401})
  }

  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const dbResult = await supabaseAdmin
      .from("Tasks")
      .delete()
      .eq("id", params.id)

  if (dbResult.error) {
    return NextResponse.json(dbResult, {status: dbResult.status});
  }

  // this could return the deleted object if we want
  return NextResponse.json(null, {status: dbResult.status}) // status is 205 on success, null body needed.
}