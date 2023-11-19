"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import FormFieldComponent from "@/components/form-components/form-field-component";
import {Checkbox} from "@/components/ui/checkbox";


const referenceFormSchema = z.object({
    title: z.string().optional(),
    body: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof referenceFormSchema>

export function ReferenceForm() {

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(referenceFormSchema),
        mode: "onChange",
      })


  function onSubmit(data: ProfileFormValues) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormFieldComponent name={'Topic'} label={'Topic'} form={form} inputType={'input'} className={'w-full mb-4'}/>
          <FormFieldComponent name={'Topic'} form={form} inputType={'textarea'}/>
          <FormDescription className={'items-center align-middle flex gap-2'}>
              Notify your employees about new reference page{" "}
              <Checkbox />
          </FormDescription>
        <Button type="submit">Create Page</Button>
      </form>
    </Form>
  )
}
