// any user with write permission can create a sale goal, but they should only
// be able to remove or modify their own goals, UNLESS they have permission to modifyAll

// handles routes /api/goal and /api/goal/{id}
// I feel bad for whoever has to clean this up later

import { NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import {
  Database,
  getEmployeeFromAuthUser,
  getRoleFromEmployee,
  postToSalesGoals,
  SalesGoalInsert,
  SalesGoalUpdate,
} from "@/lib/database";
import { createClient } from "@supabase/supabase-js";
import { add, format, startOfMonth } from "date-fns";

export async function GET(
  request: Request,
  { params }: { params: { id: string[] } },
) {
  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);

  if (!role.ReadPermission) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
  if (!params.id) {
    const dbResult = await supabaseAdmin.from("SalesGoals").select();
    return NextResponse.json(dbResult, { status: dbResult.status });
  } else {
    const dbResult = await supabaseAdmin
      .from("SalesGoals")
      .select()
      .in("id", params.id);
    return NextResponse.json(dbResult, { status: dbResult.status });
  }
}

// handle new goal input to database
export async function POST(request: Request) {
  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: SalesGoalInsert = await request.json();

  if (!role.WritePermission) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (requestBody.Creator != employee.id) {
    return NextResponse.json(
      {
        error:
          "Invalid body. Cannot create sales goal with another employee's ID",
      },
      { status: 400 },
    );
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
  const startDate = new Date(requestBody.StartDate);
  const firstDayOfMonth = startOfMonth(startDate);
  const nextMonth = add(firstDayOfMonth, { months: 1 });
  requestBody.StartDate = format(
    firstDayOfMonth,
    "yyyy-MM-dd'T'00:00:00.000'Z'",
  );
  requestBody.EndDate = format(nextMonth, "yyyy-MM-dd'T'00:00:00.000'Z'");
  const dbResult = await postToSalesGoals(supabaseAdmin, requestBody);

  return NextResponse.json(dbResult, { status: 201 }); // this is dumb
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string[] } },
) {
  if (!params.id) {
    NextResponse.json(
      { error: "No goal ID provided to modify." },
      { status: 400 },
    );
  }
  if (params.id.length > 1) {
    NextResponse.json(
      { error: "Multiple IDs provided to modify (only send one)" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: SalesGoalUpdate = await request.json();

  if (
    !role.ModifySelfPermission ||
    !role.ModifyAllPermission ||
    (requestBody.Creator != employee.id && !role.ModifyAllPermission)
  ) {
    return NextResponse.json({ error: "Forbidden." }, { status: 401 });
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
  const dbResult = await supabaseAdmin
    .from("SalesGoals")
    .update(requestBody)
    .eq("id", params.id[0])
    .single();

  return NextResponse.json(dbResult, { status: dbResult.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string[] } },
) {
  if (!params.id) {
    NextResponse.json(
      { error: "No goal ID provided to delete." },
      { status: 400 },
    );
  }
  if (params.id.length > 1) {
    NextResponse.json(
      { error: "Multiple IDs provided to delete (only send one)" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseRouteHandlerClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user);
  const role = await getRoleFromEmployee(supabase, employee);
  const requestBody: SalesGoalUpdate = await request.json();

  if (
    !role.ModifySelfPermission ||
    !role.ModifyAllPermission ||
    (requestBody.Creator != employee.id && !role.ModifyAllPermission)
  ) {
    return NextResponse.json({ error: "Forbidden." }, { status: 401 });
  }

  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
  const dbResult = await supabaseAdmin
    .from("SalesGoals")
    .delete()
    .eq("id", params.id);

  if (dbResult.error) {
    return NextResponse.json(dbResult, { status: dbResult.status });
  }

  return NextResponse.json(null, { status: dbResult.status }); // status is 205 on success, null body needed.
}
