import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {EmployeeUpdate} from "@/lib/database";

type RequiredFields<T> = {
  [K in keyof T]-?: T[K];
};

/**
 * Route to create a new employee. It requires the following fields:
 *
 *   `email: string,`
 *   `password?: string,`  (if method is "register")
 *   `Name: string,`
 *   `EmployeeNumber: string,`
 *   `Role: string,`
 *
 * @param request
 * @param params
 * @constructor
 */
export async function POST(request: NextRequest, { params }: { params: { method: string[] } }) {
  const cookieStore = cookies()
  const supabase: SupabaseClient<Database> =
      getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY!);
  const validMethods = ["invite", "register"];
  type ExpectedJSON = {
    email: string,
    password?: string,
    Name: string,
    EmployeeNumber: string,
    Role: string,
  }

  type RequiredFieldsForMethod = {
    invite: string[];
    register: string[];
  }
  const requiredFieldsForMethod: RequiredFieldsForMethod = {
    invite: ["email", "Name", "Role", "EmployeeNumber"],
    register: []
  };
  requiredFieldsForMethod.register = [...requiredFieldsForMethod.invite, "password"];

  const data = await request.json() as ExpectedJSON;
  if (!validMethods.includes(params.method[0])) {
    return NextResponse.json({error:
          `Invalid operation. Invalid method.`}, {status: 400})
  }

  const missingFields = requiredFieldsForMethod[params.method[0] as keyof RequiredFieldsForMethod]
      .filter(field => !data[field as keyof ExpectedJSON])

  if (missingFields.length !== 0) {
    return NextResponse.json({error:
          `Invalid operation. Missing field${missingFields.length > 1 ? "s" : ""}: ${missingFields.toLocaleString()}`},
        {status: 400})
  }


  let result;
  switch (params.method[0]) {
    case "invite":
      result = await supabase.auth.admin.inviteUserByEmail(data.email, {
        data: { // Pass Employee attributes to database so trigger can create an employee.
          Name: data.Name,
          EmployeeNumber: data.EmployeeNumber,
          Role: data.Role,
        },
      });

      break;
    case "register":
      result = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        user_metadata: { // Pass Employee attributes to database so trigger can create an employee.
          Name: data.Name,
          EmployeeNumber: data.EmployeeNumber,
          Role: data.Role,
        },
        email_confirm: true, // todo this auto confirms emails. probably temp?
      });
      break;
  }

  if (result?.error) {
    return NextResponse.json({error: result?.error.message}, {status: result?.error.status})
  }

  return NextResponse.json({data: result?.data.user})
}

// get info from users, add extra info from Auth user. We'll use this for extra info for admins.
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const supabase =
      getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY);

  // const userInfo = supabase.auth.admin.getUserById(params.id)
  // for now, just return a call to the database with the employee
  const userID = request.nextUrl.searchParams.get("id")
  if (!userID) {
    return NextResponse.json({error: "Invalid employee ID."} );
  }
  return NextResponse.json(await supabase.from("Employees").select().eq("id", userID))
}


// modify an employee
export async function PATCH(request: Request) {
  const cookieStore = cookies()
  const supabase: SupabaseClient<Database> =
      getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY!);

  type ExpectedJSON = {
    id: string,
    email?: string,
    password?: string,
    Name?: string,
    EmployeeNumber?: string
    Role?: number,
  }

  const requestJson: ExpectedJSON = await request.json();

  const result = await supabase.auth.admin.updateUserById(requestJson.id, {
    email: requestJson.email,
    password: requestJson.password,
    user_metadata: { // Pass Employee attributes to database so trigger can create an employee.
      Name: requestJson.Name,
      EmployeeNumber: requestJson.EmployeeNumber,
      Role: requestJson.Role,
    },
    email_confirm: true
  });

  if (result?.error) {
    return NextResponse.json({error: result?.error.message}, {status: result?.error.status})
  }

  return NextResponse.json({data: result?.data.user})
}


export async function DELETE(request: Request) {
  const cookieStore = cookies()
  const supabase: SupabaseClient<Database> =
      getSupabaseRouteHandlerClient(cookieStore, process.env.SUPABASE_SERVICE_KEY!);
  type ExpectedJSON = {
    id: string,
    email?: string,
    password?: string,
    Name?: string,
    EmployeeNumber?: string
    Role?: number,
  }
  const requestJson: ExpectedJSON = await request.json();

  const result = await supabase.auth.admin.deleteUser(requestJson.id);

  if (result?.error) {
    return NextResponse.json({error: result?.error.message}, {status: result?.error.status})
  }

  return NextResponse.json({data: result?.data.user})
}