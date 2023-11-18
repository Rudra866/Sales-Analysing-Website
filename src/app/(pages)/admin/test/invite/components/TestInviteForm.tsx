import {Database, getAllRoles, getSupabaseBrowserClient, Role, SupabaseClient, User} from "@/lib/database";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {existingEmployeeFormSchema} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";


export default function TestInviteForm() {
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
  const [data, setData] = useState<User[]>([])
  const [errors, setErrors] = useState<unknown[]>([])
  const [roles, setRoles] = useState<Role[] | null>(null);
  useEffect(() => {
    const getRoles = async () => {
      try {
        const rolesResult = await getAllRoles(supabase);
        setRoles(rolesResult)
      } catch(e) {
        console.error(e)
      }
    }

    getRoles();
  }, [supabase]);

  const handleSubmit = async (formData: any) => {
    try {
      console.log("sublit")
      const newFormData = formData;
      // Set new values in form
      form.setValue('Name', "_INVITE_TEST");
      const response = await fetch("/api/admin/employee?method=invite", {
        method: 'POST',
        body: JSON.stringify(newFormData),
      });

      const result = await response.json();
      if (result.error) {
        console.error(result.error)
        setErrors((error) => [...errors, error])
      }

      setData((data) => [...data, result.data])
    } catch (error) {
      console.error(error);
    }
  };

  const form = useForm<z.infer<typeof existingEmployeeFormSchema>>({
    resolver: zodResolver(existingEmployeeFormSchema),
    defaultValues: {
      EmployeeNumber: "_INVITE_TEST",
      Name: "_INVITE_TEST",
      email: ``,
      Role: '5',
    },
  });

  return roles && (
      <div className={"flex"}>
        <div className={"flex items-center justify-center mx-4 my-4"}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                  control={form.control}
                  name="EmployeeNumber"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>EmployeeNumber</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="EmployeeNumber"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Employee Name"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Employee Email"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="Role"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Employee Role" {...field} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                                <SelectItem value={role.id.toString()} key={role.id}>
                                  {role.RoleName}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <Button type={"submit"}>Submit</Button>
            </form>
          </Form>
        </div>
        <div>
          {/*<p>Results:</p>*/}
          {/*{data.map((user) => <p key={user.id}>Success: {user.email}</p>)}*/}
        </div>
        <div>
          <p>Errors:</p>
          {errors.map((error) => <p key={error as string}>{error as string}</p>)}
        </div>
        <div>
        </div>
      </div>
  )

}