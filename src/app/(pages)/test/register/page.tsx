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

export default function AuthRegistrationTestPage() {
  const supabase = getSupabaseBrowserClient();
  const [data, setData] = useState()
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

  function onSubmit(data:any){
    fetch("/api/admin/register", {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const form = useForm<z.infer<typeof existingEmployeeFormSchema>>({
    resolver: zodResolver(existingEmployeeFormSchema),
    defaultValues: {
      EmployeeNumber: "TEST",
      Name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password1",
      Role: "1",
    }
  });

  return roles && (
      <>
        <Button onClick={onSubmit}>Register new user</Button>
        <div>{data}</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
      </>
  )

}