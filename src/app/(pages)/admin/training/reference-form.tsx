"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormDescription} from "@/components/ui/form"
import FormFieldComponent from "@/components/form-components/form-field-component";
import {Checkbox} from "@/components/ui/checkbox";
import {
    Employee,
    getAllEmployees,
    getAllRoles,
    getSupabaseBrowserClient,
    postToReferencePages,
    Role
} from "@/lib/database";
import {referencePageFormSchema} from "@/lib/zod-schemas";
import {errorToast, successToast} from "@/lib/toasts";
import {PostgrestError} from "@supabase/postgrest-js";
import {DataTableFacetedFilter} from "@/components/data-table-faceted-filter";
import React, {useEffect, useState} from 'react';

const supabase = getSupabaseBrowserClient();

type ReferenceFormValues = z.infer<typeof referencePageFormSchema>

export default function ReferenceForm() {
    const form = useForm<ReferenceFormValues>({
        resolver: zodResolver(referencePageFormSchema),
        defaultValues: {
            body: ""
        }
    })

    const [roles, setRoles] = useState<Role[]>([])
    useEffect(() => {
        Promise.all([
            getAllRoles(supabase)
        ])
            .then(([ roles]) => {
                setRoles(roles);
            })
            .catch(err => {
                errorToast("Failed to load data.");
                console.error(err);
            })
    }, []);

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

    const names = roles.map(role => {
        return {
            label: role.RoleName,
            value: role.id.toString()
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormFieldComponent name={'title'} label={'Title'} form={form} inputType={'input'}/>
                <FormFieldComponent name={'body'} form={form} inputType={'textarea'}/>
                {names && <DataTableFacetedFilter title={"Notify your employees about new reference page "} options={names}/>}
                <Button type="submit">Create Page</Button>
            </form>
        </Form>
    )
}
