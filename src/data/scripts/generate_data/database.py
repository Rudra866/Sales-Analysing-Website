import concurrent.futures
import enum

from postgrest import APIError
from supabase.client import SupabaseException
from supabase.lib.client_options import ClientOptions

from config import SUPABASE_ENV
from supabase import create_client, Client
from tables import Employee, Sales, Table, generate_notifications

env = {}
try:
    with open(SUPABASE_ENV, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or not line.strip():
                continue

            k, v = line.strip().split('=', 1)
            env[k] = v
except IOError:
    print("Failed to open supabase env file")
    exit(1)
supabase = create_client(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_KEY"],options=ClientOptions(
    postgrest_client_timeout=30,
    storage_client_timeout=30))


def create_employees_in_database(employees):
    def create_employee_in_database(employee: Employee):
        print(employee.Email)
        try:
            result = supabase.auth.admin.create_user({
                "email": employee.Email,
                "password": "password1",
                "email_confirm": True,
                "user_metadata": {
                    "Name": employee.Name,
                    "EmployeeNumber": employee.EmployeeNumber,
                    "Role": employee.Role
                }
            }).model_dump()["user"]["id"]
            employee.id = result
            return employee
        except SupabaseException:
            print("Failed to create a user!")
            return None
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(create_employee_in_database, employee) for employee in employees]

        # Collect the results as they become available
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    Table.EMPLOYEE.value[1] = results


def create_sale_in_database(sale: Sales):
    try:
        response = supabase.table("Sales").insert(sale.to_dict()).execute()
        return response.model_dump()["data"][0]
    except:
        print("Failed to create a sale!")
        return None

def create_table_in_database(tables):
    for table in tables:
        try:
            if table.value[0] == 'Employees':
                continue
            else:
                result = supabase.table(table.value[0]).select("*").execute()
                if result.data == [objs.to_dict_with_id() for objs in table.value[1]]:
                    continue

                original_tables = [obj.to_dict() for obj in table.value[1]]
                tables_without_ids = [dict((k, v) for k, v in d.items() if k != 'id') for d in original_tables]
                response = supabase.table(table.value[0]).insert(tables_without_ids).execute()
                if table.value[0] == 'Sales':
                    for i, sale in enumerate(response.data):
                        table.value[1][i].id = sale["id"]
                        table.value[1][i].EmployeeID = sale["EmployeeID"]
                        table.value[1][i].CustomerID = sale["CustomerID"]
                    # Generate notifications
                    Table.NOTIFICATIONS.value[1] = generate_notifications(Table.EMPLOYEE.value[1], Table.SALES.value[1])

        except APIError as err:
            print(err.message)



