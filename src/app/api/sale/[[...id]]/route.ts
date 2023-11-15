// this route should be responsible for restricting access to reading / editing sales based on a user's role.
// right now, the RLS rules are pretty relaxed and anyone can read or edit any sale.
// this route will handle all requests to /api/sale as well as /api/sale/{id}

import {NextResponse} from "next/server";

// handle retrieving a single sale, or all the sales. Protects sales from being read by users with no permission.
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
