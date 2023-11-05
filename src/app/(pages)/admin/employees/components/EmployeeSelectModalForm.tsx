import React, {Dispatch, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {getSupabaseBrowserClient} from "@/lib/supabase";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Employee, getEmployeeById, Role, updateToEmployees} from "@/lib/database";
import {DialogClose} from "@radix-ui/react-dialog";
import {existingEmployeeFormSchema} from "@/lib/types";
import {useFormModalContext} from "@/components/FormModal";

/**
 * Type
 */
export type EmployeeSelectModalFormProps = {
  employee: Employee
  roles: Role[]
  variant?: "invite" | "register" | null
}

/**
 * Component to allow for viewing a user's details and modifying them. Has two states, view mode and edit mode.
 * Maybe add a toast notification here in the future so the user has more evidence it was successful?
 * @param {EmployeeSelectModalFormProps} props
 * @group React Components
 */
export function EmployeeSelectModalForm({ employee, roles, variant }: EmployeeSelectModalFormProps) {
  const formContext = useFormModalContext()
  const [editState, setEditState] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const form = useForm<z.infer<typeof existingEmployeeFormSchema>>({
    resolver: zodResolver(existingEmployeeFormSchema),
    defaultValues: {
      EmployeeNumber: employee?.EmployeeNumber ?? "",
      Name: employee?.Name ?? "",
      Role: employee?.Role.toString() ?? "",
      email: employee?.Email ?? "",
      ...(!variant || variant === "register" ? {password: ""} : {})
    },
  })

  // todo - have this call the backend, probably from a higher component
  async function onSubmit(values: z.infer<typeof existingEmployeeFormSchema>) {
    formContext?.setShowDialog(false);
  }
    // try {
    //   const { EmployeeNumber, Name, Role, email } = values;
    //   const employeeResult = await updateToEmployees(supabase, {
    //     id:employee.id, EmployeeNumber, Name, Role: parseInt(Role), Email:email});
    //
    //   if (!employeeResult) {
    //     throw new Error("No employee was updated.");
    //   }
    //
    //   formContext?.onUpdate();
    // } catch (error) {
    //   console.log("An error occurred while updating the employee record.", error);
    //   console.log(error)
    // } finally {
    //   res?.setShowDialog(false);
    // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogBody>
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
                          disabled={!editState}
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
                          disabled={!editState}
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
                          disabled={!editState}
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
                        disabled={!editState}
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
        </DialogBody>
        <DialogFooter>
          {editState ? (
              <Button type={"submit"}>Submit</Button>
          ) : (
              <Button
                  variant="destructive"
                  type="button"
                  onClick={() =>
                      setTimeout(() => {
                        setEditState(true);
                      }, 10)
                  }
              >
                Edit
              </Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>);
}
