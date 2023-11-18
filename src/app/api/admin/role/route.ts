// protected by middleware policies -- EMPLOYEE_PERMISSION

// this is not FINAL and may be modified for consistency with the other routes. Changes would move id from the body
// to the url as /api/admin/role/{id}.

// routes are accessed at /api/admin/role
import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";
import {RoleInsert, RoleUpdate} from "@/lib/database";


// will add later as a (fairly?) pointless addition, accessable at /api/admin/role for all and /api/admin/{id} for
// single result.
export function GET(request: Request) {
  return NextResponse.json({error: "Not yet implemented."})
}

/**
 * Create a new role by calling on the database as an admin. Returns the direct result from the database.
 * @param request
 * @constructor
 */
export async function POST(request: Request) {
  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const requestJSON: RoleInsert = await request.json();


  const dbResult = await supabaseAdmin.from("Roles").insert({
    ...requestJSON
  }).select();

  return NextResponse.json({
    ...dbResult
  })
}

/**
 * Update the existing role by calling on the database as an admin. Returns the direct result from the database.
 * @param request
 * @constructor
 */
export async function PATCH(request: Request) {
  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const requestJSON: RoleUpdate = await request.json();
  console.log(requestJSON)
  if (!requestJSON.id) {
    return NextResponse.json({error: "No id given to update."});
  }

  const dbResult = await supabaseAdmin.from("Roles").update({
    ...requestJSON
  }).eq("id", requestJSON.id).select();

  return NextResponse.json({
    ...dbResult
  });
}

/**
 * Delete the existing role by calling on the database as an admin. Returns the direct result from the database.
 * The passed in json body must contain at least an ID field. The deleted entry will be returned.
 * @param request
 * @constructor
 */
export async function DELETE(request: Request) {
  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const requestJSON: RoleUpdate = await request.json();

  if (!requestJSON.id) {
    return NextResponse.json({error: "No id given to delete."});
  }

  const dbResult =
      await supabaseAdmin
          .from("Roles")
          .delete()
          .eq("id", requestJSON.id!)
          .select();

  return NextResponse.json({
    ...dbResult
  });
}
