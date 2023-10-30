'use client'
import { Button } from "@/registry/new-york/ui/button"
import {
  getAllCustomers,
  getCustomer, getEmployee, getFinancing, getMonthSale,
  getNotification, getRole, getSale, getSalesGoal, getTask, getTradeIn,
  postToCustomers,
  postToEmployees,
  postToSales,
  postToSalesGoals
} from "@/lib/dbwrap"
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/lib/database.types";

/**
 * Temporary page to be able to quickly test functions of `dbwrap.ts`
 * @group Next.js Pages
 */
export default function DatabaseTestPage() {
  const supabase = createClientComponentClient<Database>()

  function handleOnClick()
  {
    getCustomer(supabase, "Eleonor Naudet").then(r => {
      if (r?.id == 1)
      {
        console.log("Customer get successful.")
      }
      else
      {
        console.log("Customer get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in customer get.")})
    getEmployee(supabase, "44351").then(r => {
      if (r?.id == 6)
      {
        console.log("Employee get successful.")
      }
      else
      {
        console.log("Employee get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in employee get.")})
    getFinancing(supabase, "Dealer").then(r => {
      if (r?.id == 1)
      {
        console.log("Financing get successful.")
      }
      else
      {
        console.log("Financing get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in financing get.")})
    getRole(supabase, 'Administrator').then(r => {
      if (r?.id == 1)
      {
        console.log("Role get successful.")
      }
      else
      {
        console.log("Role get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in role get.")})
    getNotification(supabase, 1).then(r => {
      if (r?.id == 1)
      {
        console.log("Notification get successful.")
      }
      else
      {
        console.log("Notification get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in notification get.")})
    getSale(supabase, '13365').then(r => {
      if (r?.id == 1)
      {
        console.log("Sale get successful.")
      }
      else
      {
        console.log("Sale get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in sale get.")})
    getSalesGoal(supabase, 'goal 1').then(r => {
      if (r?.id == 1)
      {
        console.log("Sale goal get successful.")
      }
      else
      {
        console.log("Sale goal get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in sale goal get.")})
    getTask(supabase, 'task 1').then(r => {
      if (r?.id == 1)
      {
        console.log("Task get successful.")
      }
      else
      {
        console.log("Task get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in task get.")})
    getTradeIn(supabase, 'GMC Canyon 4WD').then(r => {
      if (r?.id == 1)
      {
        console.log("Trade in get successful.")
      }
      else
      {
        console.log("Trade in get unsuccessful.")
      }
    }).catch(error => {console.log("Error occurred in trade in get.")})
    //postToEmployees("Madeup Fakename", "44323", "hello", "Administrator", "madeup.fakename@icloud.com")
    // postToCustomers("Ellis Mackray", "Saskatoon").then(r => {console.log(r)}).catch(error => {console.log(error)})
    //postToSales("123", "a2", 123, 123, 123, 123, 123, 44351, "Eleonor", "Naudet", "Dealer", "GMC Canyon 4WD", 123, true, 123, 123, 123, 123)
  }

  return (
      <>
        <Button onClick={event => {handleOnClick()}}>Press to post shenanigans</Button>
      </>
  )
}
