"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm, UseFormReturn} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {toast, useToast} from "@/components/ui/use-toast"
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useEffect} from "react";
import {Employee, getAllRoles, getSupabaseBrowserClient, Role} from "@/lib/database";
import {useRouter} from "next/navigation";

const createEmployeeSchema = z.object({
    Name: z.string()
        .min(1, "Role Name must not be empty")
        .max(255, "Role name exceeds limit"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email must not be empty")
        .max(255, "Email exceeds limit"),
    EmployeeNumber: z.string()
        .min(1, "Employee Number must not be empty")
        .max(255, "Employee Number exceeds limit"),
    Role: z.string()
});

type FormInputFieldProps = { // fk typescript
    form: UseFormReturn<z.infer<typeof createEmployeeSchema>>,
    name: "EmployeeNumber" | "Name" | "email",
    label: string
}

const FormInputField = ({form, name, label}: FormInputFieldProps) => (
    <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        value={field.value}
                    />
                </FormControl>
                <FormMessage/>
            </FormItem>
        )}
    />
)

interface UserFormProps {
    name?: string,
    email?: string,
    password?: string,
    number?: string
    employee?: Employee,
    role?: Role
    remove?: boolean
}

export function UserForm({name, email, password, number, employee, role, remove}: UserFormProps) {
    const supabase = getSupabaseBrowserClient();
    const [roles, setRoles] = React.useState<Role[]>([])
    // const router = useRouter()


    useEffect(() => {
        getAllRoles(supabase).then((res) => {
            setRoles(res as Role[])
            return res
        })
    }, []);

    const {toast} = useToast();
    const form = useForm<z.infer<typeof createEmployeeSchema>>({
        resolver: zodResolver(createEmployeeSchema),
        defaultValues: {
            Name: name || "",
            email: email || "",
            EmployeeNumber: number || "",
        }
    })

    // todo: make this relevant
    async function onSubmit(data: z.infer<typeof createEmployeeSchema>) {
        if (employee) { // edit existing employee
            const updatingData: any = data;
            updatingData.id = employee.id;
            const result = await fetch(`/api/admin/employee`, {
                method: "PATCH",
                body: JSON.stringify(updatingData)
            })
            if (result.ok) {
                toast({
                    title: "Employee Updated",
                    description: "The employee was successfully updated!"

                })
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: result.statusText
                })
            }
        } else { // invite an employee
            const result = await fetch(`/api/admin/employee/invite`, {
                method: "POST",
                body: JSON.stringify(data)
            })
            if (result.ok) {
                toast({
                    title: "Employee Invited",
                    description: (
                        <>
                            The email {data.email} was successfully invited!
                        </>
                    ),
                })
            } else {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: result.statusText
                })
            }
        }



            // don't think this actually works?
        // .catch((err) => {
        //     toast({
        //         title: "Error",
        //         variant: "destructive",
        //         description: (
        //             {err}
        //         ),
        //     })
        // })

    }

    const getRoleName = (id: string) => {
        const role = roles.find(role => role.id.toString() === id)
        return role?.RoleName
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormInputField form={form} name="Name" label="Employee Name"/>
                <FormInputField form={form} name="email" label="Account Email"/>
                <FormInputField form={form} name="EmployeeNumber" label="Employee Number"/>
                <FormField
                    control={form.control}
                    name="Role" // todo
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={employee && getRoleName(employee.Role.toString())} {...field} />
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
                            <FormMessage/>
                        </FormItem>)}
                />
                <div className={'flex gap-2'}>
                    <Button type="submit">Submit</Button>
                    {remove && <Button variant="destructive"
                                       onClick={() => {
                                           employee?.id &&
                                               fetch("/api/admin/employee", {
                                                   method: "DELETE",
                                                   body: JSON.stringify(employee)
                                               })
                                               .then(() => {
                                                   toast({
                                                       title: "Employee Deleted",
                                                       description: "Employee has been deleted",
                                               })
                                           }).catch((error) => {
                                                   toast({
                                                       title: "Error",
                                                       description: error
                                                   })
                                               })
                                       }}
                    >Delete</Button>}
                </div>
            </form>
        </Form>
    )
}
