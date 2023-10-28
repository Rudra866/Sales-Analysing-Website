import React, {Dispatch, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Database, Employee, Role} from "@/lib/database.types";
import {DialogClose} from "@radix-ui/react-dialog";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {existingEmployeeFormSchema} from "@/lib/types";

/**
 * Type
 */
export type EmployeeSelectModalFormProps = {
  employee: Employee
  roles: Role[]
  updateEmployee: (employee: Employee) => void
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}

/**
 * Component to allow for viewing a user's details and modifying them. Has two states, view mode and edit mode.
 * Maybe add a toast notification here in the future so the user has more evidence it was successful?
 * @param {EmployeeSelectModalFormProps} props @link EmployeeSelectModalFormProps
 * @group React Component
 */
export function EmployeeSelectModalForm({ employee, roles, setShowDialog, updateEmployee }: EmployeeSelectModalFormProps) {
  const supabase =
      createClientComponentClient<Database>();
  const [editState, setEditState] = useState(false);
  const form = useForm<z.infer<typeof existingEmployeeFormSchema>>({
    resolver: zodResolver(existingEmployeeFormSchema),
    defaultValues: {
      EmployeeNumber: employee?.EmployeeNumber ?? "",
      Name: employee?.Name ?? "",
      Email: employee?.Email ?? "",
      Role: employee?.Role.toString() ?? "",
    },
  })

  async function onSubmit(values: z.infer<typeof existingEmployeeFormSchema>) {
    try {
      const { EmployeeNumber, Name, Email, Role } = values;
      const { data, error} = await supabase
          .from('Employees')
          .update({ EmployeeNumber, Name, Email, Role: parseInt(Role)})
          .eq("id", employee.id)
          .select().single()

      if (error) {
        console.log("Supabase error: ", error);
        throw new Error("An error occurred while updating the employee record.");
      }
      updateEmployee(data);
    } catch (error) {
      console.log(error)
    } finally {
      setShowDialog(false);
    }
  }

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
              name="Email"
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
