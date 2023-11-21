'use client'

import React, {useEffect} from 'react';
import {getReferencePagesById, getSupabaseBrowserClient, postToReferencePages, ReferencePage} from "@/lib/database";
import {DbResult} from "@/lib/types";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";

const supabase = getSupabaseBrowserClient();


const referenceFormSchema = z.object({
    title: z.string().min(3).optional(),
    body: z.string().min(10).optional(),
})

type ReferenceFormValues = z.infer<typeof referenceFormSchema>


function Page(props: any) {
    const id = props.params.id;
    const [page, setPage] = React.useState<ReferencePage>();
    const [editMode, setEditMode] = React.useState<boolean>(false);

    // todo -- error prone calls..
    useEffect(() => {
        getReferencePagesById(supabase, id)
            .then((res) => {
                setPage(res as DbResult<typeof page>)
            })
    }, [id]);

    const form = useForm<ReferenceFormValues>({
        resolver: zodResolver(referenceFormSchema),
        mode: "onChange",
    })

    function onSubmit(data: ReferenceFormValues) {
        postToReferencePages(supabase, {
            pagename: form.getValues().title,
            pagebody: form.getValues().body
        }).then((res) => {
            setPage(res as DbResult<typeof page>)
            setEditMode(false)
            console.log(res)
        })
    }

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
                                        <FormDescription className={'items-center align-middle flex gap-2'}>
                                            Notify your employees about new reference page {" "}
                                            <Checkbox/>
                                        </FormDescription>
                                    </FormItem>

                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div> :
                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">{page?.pagebody}</p>
                    {/*<Separator />*/}
                    {/*<p className="text-sm text-muted-foreground">{page?.pagebody}</p>*/}
                </div>
            }

        </div>
    );
}

export default Page;
