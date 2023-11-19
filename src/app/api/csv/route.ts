import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {cookies} from "next/headers";
import {getEmployeeFromAuthUser, getRoleFromEmployee} from "@/lib/database";


export async function GET() {
  const supabase =
      getSupabaseRouteHandlerClient(cookies())
  const {data: {session}} = await supabase.auth.getSession();
  const employee = await getEmployeeFromAuthUser(supabase, session!.user)
  const role = await getRoleFromEmployee(supabase, employee);

  if (!role.ReadPermission) {
    return NextResponse.json({error: "Forbidden"}, {status: 401});
  }

  const supabaseAdmin =
      createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  const dbResult = await supabaseAdmin
      .from('Sales')
      .select(`
                    EmployeeID,
                    Employees (
                        Avatar,
                        Name,
                        Email,
                        EmployeeNumber,
                        Role
                    ),
                      ActualCashValue,
                      CustomerID,
                      DaysInStock,
                      DealerCost,
                      FinancingID,
                      Financing (
                        Method
                       ),
                      FinAndInsurance,
                      GrossProfit,
                      LotPack,
                      NewSale,
                      ROI,
                      SaleTime,
                      StockNumber,
                      Total,
                      TradeInID,
                      VehicleMake
                `)
      .order('SaleTime', { ascending: false })
      .csv();

  return NextResponse.json(dbResult)
}