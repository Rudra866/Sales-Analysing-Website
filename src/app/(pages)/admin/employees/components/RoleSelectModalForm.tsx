import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {DialogClose} from "@radix-ui/react-dialog";
import React from "react";
import {Employee, Role, getSupabaseBrowserClient} from "@/lib/database";
import {useFormModalContext} from "@/components/FormModal";

export type RoleSelectModalFormProps = {
  employee: Employee;
  roles: Role[];
}

/**
 * Component to allow selecting a role for an employee from a dropdown select list.
 * @param employee the employee to change roles of
 * @param roles list of roles to choose from
 * @param updateEmployee callback function to reload an employee in an upper component.
 * @group React Components
 */
export function RoleSelectModalForm({ employee, roles }: RoleSelectModalFormProps) {
  const formContext = useFormModalContext();
  const supabase =
      getSupabaseBrowserClient();
  const roleSelectFormSchema = z.object({
    Role:
        z.string().refine(
            (value) => {
              return !isNaN(Number(value)) && Number(value) >= 1;
            }, {
              message: "Invalid role selected."
            }
        )
  })
  const form = useForm<z.infer<typeof roleSelectFormSchema>>({
    resolver: zodResolver(roleSelectFormSchema),
    defaultValues: {
      Role: employee?.Role.toString() ?? "",
    }});

  // todo add functionality by calling the backend, probably from higher up the tree.
  async function onSubmit(values: z.infer<typeof roleSelectFormSchema>) {
    formContext?.setShowDialog(false);
    formContext?.onSubmit(null) // submit formData
    // try {
    //   const { data, error} = await supabase
    //       .from('Employees')
    //       .update({Role: parseInt(values.Role, 10)})
    //       .eq('id', employee.id)
    //       .select()
    //
    //   if (error) {
    //     console.log("Supabase error: ", error);
    //     throw new Error("An error occurred while updating the employee's role.");
    //   }
    //   formContext.onSubmit(data[0]);
    // } catch (error) {
    //   console.log(error)
    // }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8">
        <DialogBody>
          <FormField
            control={form.control}
            name="Role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
              </FormItem>)}
            />
          </DialogBody>
        <DialogFooter>
          <Button type={"submit"} variant={"ghost"}>
            Change
          </Button>
          <DialogClose>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>)
}