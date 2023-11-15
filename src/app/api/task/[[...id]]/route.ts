// this route should handle users creating tasks with their employee ID, and allow editing their own task.
// it should also handle the admin or user with permission to edit or delete any task. tasks can be blocked behind
// read permissions.

// should handle routes /api/task and /api/task/{id}


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