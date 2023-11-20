"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormDescription} from "@/components/ui/form"
import FormFieldComponent from "@/components/form-components/form-field-component";
import {Checkbox} from "@/components/ui/checkbox";
import {getSupabaseBrowserClient, postToReferencePages} from "@/lib/database";

const supabase = getSupabaseBrowserClient();

const referenceFormSchema = z.object({
    title: z.string().min(3).optional(),
    body: z.string().min(10).optional(),
})

type ReferenceFormValues = z.infer<typeof referenceFormSchema>


export function ReferenceForm() {

    const form = useForm<ReferenceFormValues>({
        resolver: zodResolver(referenceFormSchema),
        mode: "onChange",
    })

    function onSubmit(data: ReferenceFormValues) {
        postToReferencePages(supabase, {
            pagename: form.getValues().title,
            pagebody: form.getValues().body
        }).then((res) => {
                console.log(res)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormFieldComponent name={'title'} label={'Title'} form={form} inputType={'input'}/>
                <FormFieldComponent name={'body'} form={form} inputType={'textarea'}/>
                <FormDescription className={'items-center align-middle flex gap-2'}>
                    Notify your employees about new reference page {" "}
                    <Checkbox/>
                </FormDescription>
                <Button type="submit">Create Page</Button>
            </form>
        </Form>
    )
}
