'use client'

import React, {useEffect, useState} from 'react';
import {
    Employee,
    getAllEmployees, getAllRoles,
    getReferencePagesById,
    getSupabaseBrowserClient,
    postToReferencePages,
    ReferencePage,
    Role
} from "@/lib/database";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {referencePageFormSchema} from "@/lib/zod-schemas";
import {errorToast, successToast} from "@/lib/toasts";
import {PostgrestError} from "@supabase/postgrest-js";
import {DataTableFacetedFilter} from "@/components/data-table-faceted-filter";

const supabase = getSupabaseBrowserClient();


type ReferenceFormValues = z.infer<typeof referencePageFormSchema>


function Page(props: any) {
    const id = props.params.id;
    const [page, setPage] = useState<ReferencePage>();
    const [editMode, setEditMode] = useState<boolean>(false);

    // todo -- error prone calls..
    useEffect(() => {
        getReferencePagesById(supabase, id)
            .then((res) => setPage(res))
    }, [id]);

    // todo fix this
    const form = useForm<ReferenceFormValues>({
        resolver: zodResolver(referencePageFormSchema),
        mode: "onChange",
    })

    function onSubmit(data: ReferenceFormValues) {
        postToReferencePages(supabase, {
            pagename: data.title,
            pagebody: data.body
        }).then((res) => {
            setPage(res as ReferencePage)
            setEditMode(false)
            successToast(`Updated page ${res.pagename}!`)
        }).catch((err: PostgrestError) => {
            errorToast(err.message);
        })
    }

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


    const names = roles.map(role => {
        return {
            label: role.RoleName,
            value: role.id.toString()
        }
    })

    return (
        <div className="space-y-6">

            <div className={'flex flex-row justify-between '}>
                <h3 className="text-lg font-medium flex ">{page?.pagename}</h3>
                <Button variant={'outline'} onClick={()=>{setEditMode(true)}}>Edit</Button>
            </div>

            <Separator />
            {editMode ?
                <div className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name={'title'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{'Title'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value}
                                                defaultValue={page?.pagename}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={'body'}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value}
                                                defaultValue={page?.pagebody}
                                                className='lg:h-[400px] h-64'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {names && <DataTableFacetedFilter title={"Notify your employees about new reference page "} options={names}/>}
                                    </FormItem>

                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div> :
                <div className="space-y-6">
                    {/* TODO twice? why? */}
                    <p className="text-sm text-muted-foreground">{page?.pagebody}</p>
                    {/*<Separator />*/}
                    {/*<p className="text-sm text-muted-foreground">{page?.pagebody}</p>*/}
                </div>
            }

        </div>
    );
}

export default Page;
