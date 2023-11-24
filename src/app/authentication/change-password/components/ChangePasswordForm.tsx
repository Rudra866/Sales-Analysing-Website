import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {passwordChangeFormSchema} from "@/lib/zod-schemas";



export default function ChangePasswordForm({ onSubmit }: {onSubmit: (values: z.infer<typeof passwordChangeFormSchema>) => void}) {

  const form = useForm<z.infer<typeof passwordChangeFormSchema>>({
    resolver: zodResolver(passwordChangeFormSchema),
    defaultValues: {
      password: 'password',
    },
  });

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                          placeholder="******"
                          type={"password"}
                          {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
          />
          <Button type={"submit"}>Submit</Button>
        </form>
      </Form>
  )
}
