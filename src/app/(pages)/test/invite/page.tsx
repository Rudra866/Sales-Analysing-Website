"use client"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {existingEmployeeFormSchema} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {getAllRoles, Database, Role, SupabaseClient, User, getSupabaseBrowserClient} from "@/lib/database";

export default function AuthInviteTestPage() {
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

  const invitingEmployeeFormSchema = z.object({
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

    Role:
        z.string().refine(
            (value) => {
              return !isNaN(Number(value)) && Number(value) >= 1
            }, {
              message: "Invalid."
            }
        )
  })



  const handleSubmit = async (formData: any) => {
    try {
      console.log("sublit")
      const newFormData = formData;
      // Set new values in form
      form.setValue('Name', "_INVITE_TEST");
      const response = await fetch("/api/admin/invite", {
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

  const form = useForm<z.infer<typeof invitingEmployeeFormSchema>>({
    resolver: zodResolver(invitingEmployeeFormSchema),
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

};
