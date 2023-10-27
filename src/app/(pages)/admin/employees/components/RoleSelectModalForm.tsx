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
import {Row} from "@tanstack/react-table";
import {Database, Employee, Role} from "@/lib/database.types";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

interface RoleSelectModalFormProps {
  row: Row<Employee>
  roles: Role[]
  updateEmployee: (employee: Employee) => void
}
export function RoleSelectModalForm({ row, roles, updateEmployee }: RoleSelectModalFormProps) {
  const supabase = createClientComponentClient<Database>();
  const employee = row.original;
  const roleFormSchema = z.object({
    Role:
        z.string().refine(
            (value) => {
              return !isNaN(Number(value)) && Number(value) >= 1;
            }, {
              message: "Invalid role selected."
            }
        )
  })
  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      Role: employee?.Role.toString() ?? "",
    }});

  async function onSubmit(values: z.infer<typeof roleFormSchema>) {
    try {
      const { data, error} = await supabase
          .from('Employees')
          .update({Role: parseInt(values.Role, 10)})
          .eq('id', employee.id)
          .select()

      if (error) {
        console.log("Supabase error: ", error);
        throw new Error("An error occurred while updating the employee's role.");
      }
      updateEmployee(data[0]);
    } catch (error) {
      console.log(error)
    }
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