"use client"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import useAuth from "@/hooks/use-auth";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {existingEmployeeFormSchema} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {getAllRoles} from "@/lib/dbwrap";
import {Role} from "@/lib/database.types";
import {faker} from "@faker-js/faker";
import {User} from "@supabase/supabase-js";

export default function AuthRegistrationTestPage() {
  const supabase = getSupabaseBrowserClient();
  const [data, setData] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [formData, setFormData] = useState({EmployeeNumber: "", Name: "", email: "", password: "", Role: ""});
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
      const response = await fetch("/api/admin/register", {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setData((data) => [...data, result])

      // Set new values and reset the form
      form.setValue('Name', faker.person.fullName());
      form.setValue('email', faker.internet.email());
    } catch (error) {
      console.error(error);
    }
  };

  const form = useForm<z.infer<typeof existingEmployeeFormSchema>>({
    resolver: zodResolver(existingEmployeeFormSchema),
    defaultValues: {
      EmployeeNumber: "_REGISTER_TEST",
      Name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password',
      Role: '1',
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
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="******"
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
          {data.map((user) => <p key={user.id}>Success: {user.email}</p>)}</div>
      </div>
  )

}