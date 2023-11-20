import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";
import {getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {cookies} from "next/headers";
import {getEmployeeFromAuthUser, getRoleFromEmployee} from "@/lib/database";
import {format} from "date-fns";


const supabaseCSVQuery = `
          StockNumber,
          ...Employees (
              Sales Rep: Name
          ),
          ...Financing (
              FinanceMethod: Method 
          ),
          ...Customers (
              CustomerName: Name,
              City
          ),
          VehicleMake,
          ...TradeIns (
              Trade,
              TradeInValue: ActualCashValue
          ),
          Actual Cash Value: ActualCashValue,
          Gross Profit: GrossProfit,
          FinAndInsurance,
          Holdback,
          Total,
          SaleTime,
          DaysInStock,
          DealerCost,
          LotPack,
          NewSale,
          ROI
      `;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");


  if (fromDate && toDate) {
    const dbResult = await supabaseAdmin
        .from('Sales')
        .select(supabaseCSVQuery)
        .gte('SaleTime', fromDate)
        .lte('SaleTime', toDate)
        .order('SaleTime', { ascending: true })
        .csv();
    return NextResponse.json(dbResult)
  }

  const dbResult = await supabaseAdmin
      .from('Sales')
      .select(supabaseCSVQuery)
      .order('SaleTime', { ascending: true })
      .csv();
  return NextResponse.json(dbResult)
}