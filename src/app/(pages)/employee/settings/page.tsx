'use client'

import React from 'react';
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "@/components/ui/use-toast";
import FormFieldComponent from "@/components/form-components/form-field-component";
import useAuth from "@/hooks/use-auth";
import {Button} from "@/components/ui/button";


const profileFormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(30, {
        message: "Username must not be longer than 30 characters.",
    }),
    email: z.string({
        required_error: "Please select an email to display.",
    }).email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
        message: "Confirm Password must be at least 8 characters.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"] // field that the error message is attached to
});

type ProfileFormValues = z.infer<typeof profileFormSchema>


function Page() {
    const { employee} = useAuth()
    const defaultValues: Partial<ProfileFormValues> = {
        username: employee?.Name,
        email: employee?.Email,
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    function onSubmit(data: ProfileFormValues) {
        // TODO: Update user profile

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
            <div className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldComponent name={"email"} form={form} inputType={'input'} label={'Update Email'} className={'w-full'} defaultValue={defaultValues.email}/>
                        <FormFieldComponent name={"username"} form={form} inputType={'input'} label={'Update User Name'} className={'w-full'} defaultValue={defaultValues.username}/>
                        <FormFieldComponent name={"password"} form={form} inputType={'input'} label={'Update Password'} className={'w-full'}/>
                        <FormFieldComponent name={"confirmPassword"} form={form} inputType={'input'} label={'Update Password'} className={'w-full'}/>
                        <Button type="submit" >Submit</Button>
                    </form>
                </Form>
            </div>
    );
}

export default Page;
