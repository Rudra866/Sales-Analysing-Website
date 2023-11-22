

// can modify this to be the actual form, just done lazily temporarly
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {getAllRoles, Database, Role, SupabaseClient, User} from "@/lib/database";
import {passwordField} from "@/lib/zod-schemas";
import {generateRandomString} from "@/lib/utils";


const existingEmployeeFormSchema = z.object({
  EmployeeNumber:
      z.string().min(1, {
        message: "EmployeeNumber must not be empty."})
          .max(255, {
            message: "EmployeeNumber must be shorter than 255 characters."}),

  Name:
      z.string()
          .min(1, {
            message: "Employee Name must not be empty."})
          .max(255, {
            message: "Employee Name must be less than 255 characters."}),

  email:
      z.string()
          .min(1, {
            message: "Employee Email must not be empty."})
          .max(320, {
            message: "Employee Email must be less than 255 characters."})
          .email({
            message: "Employee Email must be a valid email address."}),

  password: passwordField,

  Role:
      z.string().refine(
          (value) => {
            return !isNaN(Number(value)) && Number(value) >= 1
          }, {
            message: "Invalid."
          }
      )
})

/** combine this with the TestInviteForm and use it wherever to create users. */
export default function TestRegistrationForm() {
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
      const newFormData = formData;
      newFormData["method"] = "register"
      // Set new values in form
      form.setValue('Name', "_REGISTER_TEST");
      form.setValue('email', `example${generateRandomString(25)}@email.com`)
      const response = await fetch("/api/admin/employee/register", {
        method: 'POST',
        body: JSON.stringify(newFormData)
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
      EmployeeNumber: "_REGISTER_TEST",
      Name: "_REGISTER_TEST",
      email: `example${generateRandomString(25)}@email.com`,
      password: 'password',
      Role: '5',
    },
  });

  return ( roles &&
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
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="******"
                              type={"password"}
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
          <p>Results:</p>
          {data.map((user) => <p key={user.id}>Success: {user.email}</p>)}
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