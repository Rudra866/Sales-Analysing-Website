
import { NextRequest, NextResponse } from 'next/server'
import supabase from "@/lib/supabase";





export async function GET(req: NextRequest, res: NextResponse) {
    const { data, error } = await supabase.from('todos').select()
}
