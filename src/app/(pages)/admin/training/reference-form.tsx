"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormDescription} from "@/components/ui/form"
import FormFieldComponent from "@/components/form-components/form-field-component";
import {Checkbox} from "@/components/ui/checkbox";
import {getSupabaseBrowserClient, postToReferencePages} from "@/lib/database";
import {referencePageFormSchema} from "@/lib/zod-schemas";
import {errorToast, successToast} from "@/lib/toasts";
import {PostgrestError} from "@supabase/postgrest-js";

const supabase = getSupabaseBrowserClient();


type ReferenceFormValues = z.infer<typeof referencePageFormSchema>


export default function ReferenceForm() {
    const form = useForm<ReferenceFormValues>({
        resolver: zodResolver(referencePageFormSchema),
        defaultValues: {
            body: ""
        }
    })

    function onSubmit(data: ReferenceFormValues) {
        postToReferencePages(supabase, {
            pagename: data.title,
            pagebody: data.body
        }).then((res) => {
            successToast(`Created page ${res.pagename}!`)
        }).catch((err: PostgrestError) => {
            errorToast(err.message);
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormFieldComponent name={'title'} label={'Title'} form={form} inputType={'input'}/>
                <FormFieldComponent name={'body'} form={form} inputType={'textarea'}/>
                <FormDescription className={'items-center align-middle flex gap-2'}>
                    <span>Notify your employees about new reference page </span>
                    <Checkbox/>
                </FormDescription>
                <Button type="submit">Create Page</Button>
            </form>
        </Form>
    )
}
