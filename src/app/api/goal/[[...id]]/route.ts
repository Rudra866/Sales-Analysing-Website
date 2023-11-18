// any user with write permission can create a sale goal?, but they should only
// be able to remove or modify their own goals. this route should allow admins to modify or delete any goal.
// ^ some of this could be handled by RLS, but not if we want read permission to restrict sale goals.

// should handle routes /api/goal and /api/goal/{id}

import {NextResponse} from "next/server";

export function GET(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

// handle new sale input to database
export function POST(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

export function PATCH(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}

export function DELETE(request: Request) {
  return NextResponse.json({error: "Not yet implemented."}, {status: 405})
}