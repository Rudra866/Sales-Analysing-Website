/*** TEMP -- MERGE WITH ALEX DB LIB ***/
import {SupabaseClient, User} from "@supabase/supabase-js";
import {Database, Employee} from "@/lib/database.types";


export async function getEmployeeFromAuthUser(supabase: SupabaseClient<Database>, authUser: User | null) {
  if (authUser === null) {
    return {data: null};
  }
  return supabase
      .from('Employees')
      .select()
      .eq("AuthUser", authUser.id)
      .single();
}

export async function getRoleFromEmployee(supabase: SupabaseClient<Database>, employee: Employee | null) {
  if (employee === null) {
    return {data: null};
  }
  return supabase
      .from('Roles')
      .select()
      .eq("id", employee.Role)
      .single();
}