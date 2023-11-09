// this route should be responsible for restricting access to reading / editing sales based on a user's role.
// right now, the rls rules are pretty relaxed and anyone can read or edit any sale.

import {NextResponse} from "next/server";

export function GET(request: Request) {
  return NextResponse.json({error: "Not yet implemented."})
}