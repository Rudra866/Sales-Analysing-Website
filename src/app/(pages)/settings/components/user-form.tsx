"use client"

import Link from "next/link"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm, UseFormReturn} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {toast, useToast} from "@/components/ui/use-toast"
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {FormToggleField} from "@/components/form-components/form-toggle-field";
// import {FormToggleField} from "@/components/form-components/form-toggle-field";

const role_options_config = [
    {
        label: "Read Access",
        name: "read",
        description: "Employee can view and read sales ",
        default: true
    },
    {
        label: "Create Access",
        name: "create",
        description: "Employee can create new sales ",
        default: true
    },
    {
        label: "Modify Own Sales",
        name: "modifySelf",
        description: "Employee can modify their own sales ",
        default: true
    },
    {
        label: "Modify All Sales",
        name: "modifyAll",
        description: "Employee can modify any sales in the system.",
        default: false
    },
    {
        label: "Employee Management",
        name: "employees",
        description: "Employee can manage employees ",
        default: false
    },
    {
        label: "Full Access",
        name: "admin",
        description: "Employee has full administrative access ",
        default: false
    },
]




const roles = Object.fromEntries(
    role_options_config.map((role) => [role.name, z.boolean()])
);
const role_defaults = Object.fromEntries(
    role_options_config.map((role) => [role.name, role.default])
);
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
    ...roles
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
}
export function UserForm({name, email, password, number}: UserFormProps) {
    const {toast} = useToast();
    const form = useForm<z.infer<typeof createRoleModalSchema>>({
        resolver: zodResolver(createRoleModalSchema),
        defaultValues: {
            name: name || "",
            email: email || "",
            password: password || "",
            number: number || "",
            ...role_defaults
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

                {role_options_config.map((role) => (
                    <div key={role.name} className="">
                        <FormToggleField {...role} form={form} />
                    </div>
                ))}
                <Button type="submit">Add User</Button>
            </form>
        </Form>
    )
}
