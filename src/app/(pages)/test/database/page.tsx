'use client'
import { Button } from "@/components/ui/button"
import {
  getCustomer, getEmployee, getFinancing,
  getNotification, getRole, getSale, getSalesGoal, getTask, getTradeIn,
  getSupabaseBrowserClient
} from "@/lib/database"
import {} from "@/lib/supabase";
/**
 * Temporary page to be able to quickly test functions of `database.ts`
 * @group Next.js Pages
 */
export default function DatabaseTestPage() {
  const supabase = getSupabaseBrowserClient()



  /** update these on DB change. */
  const db_constants = {
    customer: "Eleonor Naudet",
    employee: "44346",
    financer: "Dealer",
    role: 'Administrator',
    notification: 1,
    sale: '13365',
    saleGoal: 'goal 1',
    task: 'task 1',
    tradeIn: 'GMC Canyon 4WD'
  }

  function test_getCustomer() {
    getCustomer(supabase, db_constants.customer).then(r => {
      if (r?.id == 1) console.log("Customer get successful.", r)
      else            console.log("Customer get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in customer get.")})
  }

  // TODO
  function test_getEmployee() {
    getEmployee(supabase, db_constants.employee).then(r => {
      if (r?.id) console.log("Employee get successful.", r)
      else            console.log("Employee get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in employee get.")})
  }

  function test_getFinancing() {
    getFinancing(supabase, db_constants.financer).then(r => {
      if (r?.id == 1) console.log("Financing get successful.", r)
      else            console.log("Financing get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in financing get.")})
  }

  function test_getRole() {
    getRole(supabase, db_constants.role).then(r => {
      if (r?.id == 1) console.log("Role get successful.", r)
      else            console.log("Role get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in role get.")})
  }

  function test_getNotification() {
    getNotification(supabase, db_constants.notification).then(r => {
      if (r?.id == 1) console.log("Notification get successful.", r)
      else            console.log("Notification get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in notification get.")})
  }

  function test_getSale() {
    getSale(supabase, db_constants.sale).then(r => {
      if (r?.id == 1) console.log("Sale get successful.", r)
      else            console.log("Sale get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in sale get.")})
  }

  function test_getSaleGoal() {
    getSalesGoal(supabase, db_constants.saleGoal).then(r => {
      if (r?.id == 1) console.log("Sale goal get successful.", r)
      else            console.log("Sale goal get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in sale goal get.")})
  }

  function test_getTask() {
    getTask(supabase, db_constants.task).then(r => {
      if (r?.id == 1) console.log("Task get successful.", r)
      else            console.log("Task get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in task get.")})
  }

  function test_getTradeIn() {
    getTradeIn(supabase, db_constants.tradeIn).then(r => {
      if (r?.id == 1) console.log("Trade in get successful.", r)
      else            console.log("Trade in get unsuccessful.", r)
    }).catch(error => {console.log("Error occurred in trade in get.")})
  }

  const all_functions = [
    test_getCustomer,
    test_getEmployee,
    test_getFinancing,
    test_getSale,
    test_getRole,
    test_getNotification,
    test_getSaleGoal,
    test_getTask,
    test_getTradeIn,
  ]

  return (
      <>
      <div>
        {<div>Check console log for test output</div>}
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Button className="w-full" onClick={() => all_functions.forEach((fun) => fun())}>
            Run all tests
          </Button>
          {all_functions.map((fun) => (
              <Button className="w-full" key={fun.name} onClick={() => fun()}>
                {fun.name}
              </Button>
          ))}
        </div>
      </div>
    </>
  )
}
