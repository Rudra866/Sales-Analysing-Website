import {Database,
  Employee, EmployeeInsert, EmployeeUpdate,
  Customer, CustomerInsert, CustomerUpdate,
  Financier, FinancierInsert, FinancierUpdate,
  MonthlySale, MonthlySaleInsert, MonthlySaleUpdate,
  Role, RoleInsert, RoleUpdate,
  Notification, NotificationInsert, NotificationUpdate,
  Sale, SaleInsert, SaleUpdate,
  SalesGoal, SalesGoalInsert, SalesGoalUpdate,
  Task, TaskInsert, TaskUpdate,
  TradeIn, TradeInInsert, TradeInUpdate}
  from "@/lib/database.types"
import type {User} from "@supabase/auth-helpers-nextjs";
import type {SupabaseClient} from "@supabase/auth-helpers-nextjs";

// export type for docs
import {PostgrestError} from "@supabase/supabase-js";
export type { PostgrestError };

// todo find a less stupid way to do this for TypeDoc?
/**
 * How to use the database functions:
 *
 * @example
 * First, create a SupabaseClient:
 * ```ts
 * //Client:
 *
 * const supabase = createClientComponentClient<Database>();
 *
 * //Server:
 *
 * const supabase = createServerComponentClient<Database>();
 *
 * //Middleware:
 *
 * const supabase = createMiddlewareClient<Database>({ req, res });
 *
 * //Route:
 *
 * import { cookies } from 'next/headers'
 * //... inside route
 * const cookieStore = cookies();
 * const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
 * ```
 * Then, pass whichever client to any of the database functions, making sure to check for errors and ensuring that
 * you did not receive null:
 * ```ts
 * try {
 *    const employee: Employee = await getEmployee(supabase, employeeNumber);
 * } catch(e) {
 * // Either log the error, or use toasts or some other way to notify the user that it has failed.
 *    console.error("Database error...", e);
 * }
 *
 */
export interface DatabaseUsage{}

/**
 * Returned from some database methods when we were expecting an employee but it was not found.
 * Likely being removed soon.
 *  @public
 *  @class
 *  @implements {Error}
 */
class EmployeeIDNotFoundError implements Error {
  message: string;
  name: string;

  constructor(mes: string, name: string) {
    this.message = mes;
    this.name = name;
  }

}

// we can add extra error reporting later to make error messages nicer. This could let us use toasts/other notifs directly
// to report to the user the transaction failed.

/**
 * Gets a customer row given the full name (Firstname Lastname)
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {string} fullName String in the form firstname lastname
 * @returns {Promise<Customer | null>} The first customer with a matching name.
 * @throws {@link PostgrestError} on database error
 * @category Customer
 */
export async function getCustomer(supabase: SupabaseClient  , fullName: string): Promise<Customer>
{
  const {data:customer, error} = await supabase
      .from('Customers')
      .select('*')
      .eq('Name', "AAAAAA")
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return customer;
}

/**
 * Get an employee given their employee number.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} employeeNumber The employee number of the employee to get.
 * @returns {Promise<Employee | null>} The first employee with a matching employee number, else null.
 * @throws {@link PostgrestError} on database error
 * @category Employee
 */
export async function getEmployee(supabase: SupabaseClient, employeeNumber: string): Promise<Employee | null>
{
  const {data: employee, error} = await supabase
      .from('Employees')
      .select('*')
      .eq('EmployeeNumber', employeeNumber)
      .maybeSingle();

  if (error) throw error;
  return employee;
}

/**
 * Get a financing option with the given name.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} name Name of the financing option
 * @returns {Promise<Financier | null>} The first financier with a matching name, else null.
 * @throws {@link PostgrestError} on database error
 * @category Financing
 */
export async function getFinancing(supabase: SupabaseClient, name: string): Promise<Financier | null>
{
  const {data: financier, error} = await supabase
      .from('Financing')
      .select()
      .eq('Method', name)
      .maybeSingle();

  if (error) throw error;
  return financier;
}

/**
 * Get a monthly sale with the exact start date as given.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {Date} startDate The start date of the month sale.
 * @returns {Promise<MonthlySale | null>} The first monthly sale with the matching start date, else null.
 * @throws {@link PostgrestError} on database error
 * @category Monthly Sale
 */
export async function getMonthSale(supabase: SupabaseClient, startDate: Date): Promise<MonthlySale | null>
{
  const {data: monthlySale, error} = await supabase
      .from('MonthlySales')
      .select('*')
      .eq('TimePeriod', startDate)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return monthlySale;
}

/**
 * Gets the row of the role with matching name as given.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} roleName Name of the role
 * @returns {Promise<Role | null>} The first role matching the name as given, else null.
 * @throws {@link PostgrestError} on database error
 * @category Role
 */
export async function getRole(supabase: SupabaseClient, roleName: string): Promise<Role | null>
{
  const {data: role, error} = await supabase
      .from('Roles')
      .select('*')
      .eq('RoleName', roleName)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return role;
}

// id is better, no duplicates && just as easy to access. Not sure we need a call for "a" notification, we should get
// them all, or at least a quantity of some
/**
 * Get the row in the notifications table with the matching employee id.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} employeeId The employee number that the notification belongs to.
 * @returns {Promise<Notification | null>} The first notification matching the employee number, else null.
 * @throws {@link PostgrestError} on database error
 * @category Notification
 */
export async function getNotification(supabase: SupabaseClient, employeeId: number): Promise<Notification | null>
{
  const {data: notification, error} = await supabase
      .from('Notifications')
      .select('*')
      .eq('Employee', employeeId)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return notification;
}

// we can paginate this later if needed based on how we implement visual notifications.
/**
 * Get all rows in the notifications table with the matching employee id.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} employeeId The employee number that the notification belongs to.
 * @returns {Promise<Notification | null>} The first notification matching the employee number, else null.
 * @throws {@link PostgrestError} on database error
 * @category Notification
 */
export async function getNotificationsForEmployee(supabase: SupabaseClient, employeeId: number): Promise<Notification[] | null>
{
  const {data: notification, error} = await supabase
      .from('Notifications')
      .select('*')
      .eq('Employee', employeeId)

  if (error) throw error;
  return notification;
}

/**
 * Get the row in the Sales table with the matching stock number.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} stockNum The stock number of the sale.
 * @returns {Promise<Sale | null>} The first sale matching the stock number, else null.
 * @throws {@link PostgrestError} on database error
 * @category Sale
 */
export async function getSale(supabase: SupabaseClient, stockNum: string): Promise<Sale | null>
{
  const {data: sale, error} = await supabase
      .from('Sales')
      .select('*')
      .eq('StockNumber', stockNum)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return sale;
}

/**
 * Get the row in which the goal name matches.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route)
 * @param {string} goalName The name of the goal.
 * @returns {Promise<SalesGoal | null>} The first sales goal matching the goal name, else null.
 * @throws {@link PostgrestError} on database error
 * @category Sales Goal
 */
export async function getSalesGoal(supabase: SupabaseClient, goalName: string): Promise<SalesGoal | null>
{
  const {data: salesGoal, error} = await supabase
      .from('SalesGoals')
      .select('*')
      .eq('Name', goalName)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return salesGoal;
}

/**
 * Get the row in the tasks table with the specified name.
 * Response: The row in the tasks table with the specified name. Undefined if none match.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {string} taskName The name of the task.
 * @returns {Promise<Task | null>} The first task matching the task name, else null.
 * @throws {@link PostgrestError} on database error
 * @category Task
 */
export async function getTask(supabase: SupabaseClient, taskName: string): Promise<Task | null>
{
  const {data: task, error} = await supabase
      .from('Tasks')
      .select('*')
      .eq('Name', taskName)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return task;
}

// is there much point to this one? There may be multiple duplicates, and our sales record holds an id.
// we probably want to return multiple if we have?
/**
 * Get the row in the tradeins table that matches the trade name given.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {string} tradeName The name of the tradein.
 * @returns {Promise<TradeIn | null>} The first tradeIn the trade name, else null.
 * @throws {@link PostgrestError} on database error
 * @category Trade In
 */
export async function getTradeIn(supabase: SupabaseClient, tradeName: string): Promise<TradeIn | null>
{
  const {data:tradeIn, error} = await supabase
      .from('TradeIns')
      .select('*')
      .eq('Trade', tradeName)
      .limit(1)
      .maybeSingle();

  if (error) throw error;
  return tradeIn;
}

/**
 * Obtain the employee that is associated with the authUser session.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {User} authUser Supabase auth user object. A user has access to this when signed in.
 * @throws {@link PostgrestError} if authUser is null or doesn't exist, or database error.
 * @category Employee
 */
export async function getEmployeeFromAuthUser(supabase: SupabaseClient, authUser: User): Promise<Employee | null> {
  const {data: employee, error} = await supabase
      .from('Employees')
      .select()
      .eq("AuthUser", authUser.id)
      .single();

  if (error) throw error;
  return employee;
}

/**
 * Obtain the role that is associated with the Employee.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {Employee} employee An employee object from the database.
 * @returns {Promise<Role | null>}
 * @throws {@link PostgrestError} if employee is null or doesn't exist, or database error.
 * @category Role
 */
export async function getRoleFromEmployee(supabase: SupabaseClient, employee: Employee): Promise<Role | null> {
  const {data: role, error} = await supabase
      .from('Roles')
      .select()
      .eq("id", employee.Role)
      .single();

  if (error) throw error;
  return role;
}

/**
 * Get all the rows of the customers table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<Customer[] | null>} All the customers in the database, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Customer
 */
export async function getAllCustomers(supabase: SupabaseClient): Promise<Customer[] | null>
{
  const {data: customers, error} = await supabase
      .from('Customers')
      .select('*');

  if (error) throw error;
  return customers;
}

/**
 * Get all the rows of the employees table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<Employee[] | null>} All the employees in the database, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Employee
 */
export async function getAllEmployees(supabase: SupabaseClient): Promise<Employee[] | null>
{
  const {data: employees, error} = await supabase
      .from('Employees')
      .select('*');

  if (error) throw error;
  return employees;
}

/**
 * Get all rows in the financing table.
 * @param supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<Financier[] | null>} All the financiers in the database, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Financing
 */
export async function getAllFinancingOptions(supabase: SupabaseClient): Promise<Financier[] | null>
{
  const {data: financiers, error} = await supabase
      .from('Financing')
      .select('*')

  if (error) throw error;
  return financiers;
}

/**
 * Get all monthly sales in the monthlysales table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<MonthlySale[] | null>} All the financiers in the database, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Monthly Sale
 */
export async function getAllMonthlySales(supabase: SupabaseClient): Promise<MonthlySale[] | null>
{
  const {data: monthlySales, error} = await supabase
      .from('MonthlySales')
      .select('*')

  if (error) throw error;
  return monthlySales;
}

/**
 * Get all rows in the Roles table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<Role[] | null>} All roles in the database, or none.
 * @throws {@link PostgrestError} on database error.
 * @category Role
 */
export async function getAllRoles(supabase: SupabaseClient): Promise<Role[] | null>
{
  const {data: roles, error} = await supabase
      .from('Roles')
      .select('*')

  if (error) throw error;
  return roles;
}

/**
 * Get all rows in the notifications table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @throws {@link PostgrestError} on database error.
 * @category Notification
 */
export async function getAllNotifications(supabase: SupabaseClient): Promise<Notification[] | null>
{
  const {data: notifications, error} = await supabase
      .from('Notifications')
      .select('*')

  if (error) throw error;
  return notifications;
}

/**
 * Get all rows in the Sales table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @throws {@link PostgrestError} on database error.
 * @category Sale
 */
export async function getAllSales(supabase: SupabaseClient): Promise<Sale[] | null>
{
  const row = await supabase
      .from('Sales')
      .select('*')

  if (row.error) throw row.error;
  return row.data;
}

/**
 * Get all rows in the SalesGoals table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<SalesGoal[] | null>} A list of all sales goals, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Sales Goal
 */
export async function getAllSalesGoals(supabase: SupabaseClient): Promise<SalesGoal[] | null>
{
  const {data: salesGoals, error} = await supabase
      .from('SalesGoals')
      .select('*');

  if (error) throw error;
  return salesGoals;
}

/**
 * Get all rows in the tasks table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<Task[] | null>} A list of all tasks, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Task
 */
export async function getAllTasks(supabase: SupabaseClient): Promise<Task[] | null>
{
  const {data: tasks, error} = await supabase
      .from('Tasks')
      .select('*')

  if (error) throw error;
  return tasks;
}

/**
 * Get all rows in the TradeIns table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @returns {Promise<TradeIn[] | null>} A list of all tasks, or null if none exist.
 * @throws {@link PostgrestError} on database error.
 * @category Trade In
 */
export async function getAllTradeIns(supabase: SupabaseClient): Promise<TradeIn[] | null>
{
  const {data: tradeIns, error} = await supabase
      .from('TradeIns')
      .select('*');

  if (error) throw error;
  return tradeIns;
}

// since creator is required for this type, it cannot be null, and inserting will fail anyways if employee not found.
/**
 * Takes in the specified parameters and posts them to db.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {SalesGoalInsert} newSaleGoal
 * @throws {@link PostgrestError} if Creator is null or doesn't exist, or on database insert error.
 * @category Sales Goal
 */
export async function postToSalesGoals(supabase: SupabaseClient, newSaleGoal: SalesGoalInsert): Promise<SalesGoal>
{
  const {data: saleGoal, error} = await supabase
      .from('SalesGoals')
      .insert(newSaleGoal)
      .select()
      .limit(1)
      .single();

  if (error) throw error;

  return saleGoal;
}

// leaving this one for now, but we should make our forms use interactive components, and this will let us get the
// ids from those. EX. see src/app/(pages)/admin/employees/components/EmployeeSelectModalForm.tsx
// for fields like financiers we could use autofilling form + new financier button or something.
// customer will have to be created, but we can use upsert() to update/insert, in case the customer is a return custy.
// todo this && it's throws.
/**
 * Takes the information given and posts a row to the db.
 * IMPORTANT NOTE: Function assumes nothing. If a trade in or finance option has not been created, it will create it.
 * Be sure to check db using getSales if things already exist. However, an employee or customer must already exist.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param stockNum Stock number of the vehicle sale.
 * @param make The make of the vehicle
 * @param cashVal The cash value of the vehicle
 * @param grossProfit The profit obtained by the vehicle
 * @param finAndInsurance The cost of financing and insurance
 * @param holdback The holdback payment
 * @param total Total profit
 * @param employeeID Employee number of the person who made sale
 * @param customerFirstName Customer's first name
 * @param customerLastName Customer's last name
 * @param financingOption Financing option chosen
 * @param tradeIn The vehicle traded in (optional)
 * @param tradeInValue The trade ins value
 * @param newSale
 * @param lotpack
 * @param daysinstock
 * @param dealercost
 * @param roi
 * @throws {@link PostgrestError} on database insert error.
 * @category Sale
 */
export async function postToSales(supabase: SupabaseClient, stockNum: string, make: string, cashVal: number,
                                  grossProfit: number, finAndInsurance: number, holdback: number, total: number,
                                  employeeID: number, customerFirstName: string, customerLastName: string,
                                  financingOption: string, tradeIn: string, tradeInValue: number, newSale: boolean,
                                  lotpack: number, daysinstock: number, dealercost: number, roi: number): Promise<Sale>
{
  // Big function here. Got to check many things
  const getTradein = await supabase
      .from('TradeIns')
      .select('id')
      .eq('Trade', tradeIn)

  if (getTradein.data == undefined) // Case where there is no such tradein
  {
    throw TypeError
  }
  const tradeInId = getTradein.data[0].id
  // not all sales involve tradeIns
  console.log(tradeInId)

  var financeResp = await supabase
      .from('Financing')
      .select('id')
      .eq('Method', financingOption)

  if (financeResp.data == null)
  {
    throw TypeError
  }

  const financeID = financeResp.data[0].id

  console.log(financeID)

  const employeeResp = await supabase
      .from('Employees')
      .select('id')
      .eq('EmployeeNumber', employeeID)

  if (employeeResp.error != null)
  {
    throw new EmployeeIDNotFoundError("Error: Employee not found.", "")
  }

  const employeeRowID = employeeResp.data[0].id

  console.log(employeeRowID)

  const customerResp = await supabase
      .from('Customers')
      .select('id')
      .eq('Name', customerFirstName+" "+customerLastName)

  if (customerResp.error != null)
  {
    throw new Error()
  }

  const customerRowID = customerResp.data[0].id

  console.log(customerRowID)

  // Now we have all the references pulled. Lets pop this bad boy into the db

  const collatedData = {
    StockNumber: stockNum,
    VehicleMake: make,
    ActualCashValue: cashVal,
    GrossProfit: grossProfit,
    FinAndInsurance: finAndInsurance,
    Holdback: holdback,
    Total: total,
    SaleTime: new Date().toTimeString(),
    EmployeeID: employeeRowID,
    CustomerID: customerRowID,
    FinancingID: financeID,
    TradeInID: tradeInId,
    NewSale: newSale,
    LotPack: lotpack,
    DaysInStock: daysinstock,
    DealerCost: dealercost,
    ROI: roi
  }

  console.log(collatedData)

  const finalPost = await supabase
      .from('Sales')
      .insert(collatedData)
      .select()
      .limit(1)
      .single();

  return finalPost.data;

}

/**
 * Posts to the customers table. If the customer exists already, it just updates it if anything has changed.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {CustomerInsert} newCustomer
 * @throws {@link PostgrestError} on database insert error.
 * @category Customer
 */
export async function postToCustomers(supabase: SupabaseClient, newCustomer: CustomerInsert): Promise<Customer | null>
{
  const {data: customers, error} = await supabase
      .from('Customers')
      .upsert(newCustomer)
      .select()
      .limit(1)
      .single();

  if (error) throw error;
  return customers;
}

// don't need to verify that a role exists, it will just fail to insert.
/**
 * Posts a new employee to the employee table.
 * NOTE: The role must exist in the Roles table
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {EmployeeInsert} newEmployee
 * @throws {@link PostgrestError} if EmployeeInsert.Role is null, or on database insert error.
 * @category Employee
 */
export async function postToEmployees(supabase: SupabaseClient, newEmployee: EmployeeInsert): Promise<Employee>
{
  const {data: employee, error} = await supabase
      .from("Employees")
      .insert(newEmployee)
      .select()
      .limit(1)
      .single();

  if (error) throw error;
  return employee;
}

// switched to upsert and todo set {financier.Method} to be unique?
/**
 * Posts to the Financing table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {FinancierInsert} newFinancier
 * @throws {@link PostgrestError} on database insert error.
 * @category Financing
 */
export async function postToFinancing(supabase: SupabaseClient, newFinancier: FinancierInsert): Promise<Financier>
{
  const {data: financier, error} = await supabase
      .from('Financing')
      .upsert(newFinancier)
      .select()
      .limit(1)
      .single();

  if (error) throw error;
  return financier;
}

/**
 * Posts a new row into the MonthlySales table
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {MonthlySaleInsert} newMonthlySale
 * @throws {@link PostgrestError} on database insert error.
 * @category Monthly Sale
 */
export async function postToMonthlySales(supabase: SupabaseClient, newMonthlySale: MonthlySaleInsert): Promise<MonthlySale>
{
  const {data: monthlySale, error} = await supabase
      .from('MonthlySales')
      .insert(newMonthlySale)
      .select()
      .limit(1)
      .single();

  if (error) throw error;
  return monthlySale;
}

/**
 * Posts a notification to the Notification table
 *
 * Both `Employee` and `Sale` fields must be valid corresponding IDs in the database.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {NotificationInsert} newNotification
 * @throws {@link PostgrestError} if employee or sale doesn't exist, or database insert error.
 * @category Notification
 */
export async function postToNotifications(supabase: SupabaseClient, newNotification: NotificationInsert): Promise<Notification>
{
  const {data: notification, error} = await supabase
      .from('Notifications')
      .insert(newNotification)
      .select()
      .limit(1)
      .single();

  if (error) throw error;
  return notification;
}


// todo task table may need some extra not null restrictions
// todo at least one for sure on col Creator. then we don't need to do extra calls.
// todo left for now
/**
 * Post a new task to Task table.
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param {TaskInsert} newTask new task with required fields.
 * @throws {@link PostgrestError} if `Creator` or `Assignee` doesn't exist, or on database insert error.
 * @category Task
 */
export async function postToTasks(supabase: SupabaseClient, newTask: TaskInsert): Promise<Task>
{
  if (!newTask.Creator) throw new Error("New tasks need a creator!"); // temp until db update
  const employeeResp = await supabase
      .from('Employees')
      .select()
      .eq('id', newTask.Creator)
      .limit(1)
      .maybeSingle();

  // If the response has an error (which is most likely a not found error), throw a new exception
  if (employeeResp.error || !employeeResp.data)
  {
    throw employeeResp.error ?? new Error;
  }

  const assigneeResp = await supabase
      .from('Employees')
      .select()
      .eq("id", newTask.Assignee)
      .limit(1)
      .maybeSingle();

  // If the response has an error (which is most likely a not found error), throw a new exception
  if (assigneeResp.error || !assigneeResp.data)
  {
    throw new EmployeeIDNotFoundError("Employee ID not found", "");
  }

  const post = await supabase
      .from('Tasks')
      .insert(newTask)
      .select()
      .limit(1)
      .single();

  if (post.error) throw post.error;
  return post.data;
}

/**
 * Post a new tradein to the TradeIn table
 * @param {SupabaseClient} supabase Any type of Supabase client (client, server, middleware, route).
 * @param newTradeIn
 * @throws {@link PostgrestError} on database insert error.
 * @category Trade In
 */
export async function postToTradeIns(supabase: SupabaseClient, newTradeIn: TradeInInsert): Promise<TradeIn>
{
  const {data: tradeIn, error} = await supabase
      .from('TradeIns')
      .insert(newTradeIn)
      .select()
      .limit(1)
      .single()

  if (error) throw error;
  return tradeIn
}

