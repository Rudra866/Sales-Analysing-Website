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

const createRoleModalSchema = z.object({
    name: z.string()
        .min(1, "Role Name must not be empty")
        .max(255, "Role name exceeds limit"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email must not be empty")
        .max(255, "Email exceeds limit"),
    password: z.string()
        .min(1, "Password must not be empty")
        .max(255, "Password exceeds limit"),
    number: z.string()
        .min(1, "Employee Number must not be empty")
        .max(255, "Employee Number exceeds limit"),
    role: z.string()
});

type FormInputFieldProps = { // fk typescript
    form: UseFormReturn<z.infer<typeof createRoleModalSchema>>,
    name: "number" | "name" | "email" | "password",
    label: string
}

const FormInputField = ({form, name, label}: FormInputFieldProps) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        value={field.value}
                    />
                </FormControl>
                <FormMessage />
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
}
export function UserForm({name, email, password, number, employee, role}: UserFormProps) {
    const supabase = getSupabaseBrowserClient();
    const [roles, setRoles] = React.useState<Role[]>([])

    useEffect(() => {
        getAllRoles(supabase).then((res) => {
            setRoles(res as Role[])
            return res
        })
    }, []);

    const {toast} = useToast();
    const [showRoleModal, setShowRoleModal] = React.useState(false)
    const form = useForm<z.infer<typeof createRoleModalSchema>>({
        resolver: zodResolver(createRoleModalSchema),
        defaultValues: {
            name: name || "",
            email: email || "",
            password: password || "",
            number: number || "",
        }
    })

    // todo: make this relevant
    function onSubmit(data: z.infer<typeof createRoleModalSchema>) {
        console.log(data)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormInputField form={form} name="name" label="Employee Name" />
                <FormInputField form={form} name="email" label="Account Email" />
                <FormInputField form={form} name="password" label="Account Password" />
                <FormInputField form={form} name="number" label="Employee Number" />
                <FormField
                    control={form.control}
                    name="role" // todo
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
                <Button type="submit">Add User</Button>
            </form>
        </Form>
    )
}
