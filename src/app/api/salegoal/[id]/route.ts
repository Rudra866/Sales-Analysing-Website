// users can create sales goals (or we can restrict based on roles or something), but they should only
// be able to remove or modify their own goals. this route should allow admins to modify or delete any goal.


import {NextResponse} from "next/server";

export function GET(request: Request) {
  return NextResponse.json({error: "Not yet implemented."})
}