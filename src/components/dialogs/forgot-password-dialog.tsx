import { z } from "zod";
import { useFormModalContext } from "@/components/dialogs/form-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DialogFooter } from "@/components/ui/dialog";
import DialogCloseButton from "@/components/dialogs/dialog-close-button";
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction, useState } from "react";
import { forgotPasswordDialogSchema } from "@/lib/zod-schemas";

const waitDuration = 60000;

export type ForgotPasswordDialogProps = {
  success: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
};

// todo maybe move timeout outside of modal so it can't be bypassed as easy?
//  or handle entirely on server side, but the api method will still always be accessible.
export default function ForgotPasswordDialog({
  error,
  setError,
  success,
  setSuccess,
}: ForgotPasswordDialogProps) {
  const [isButtonActive, setIsButtonActive] = useState<boolean>(true);
  const formContext = useFormModalContext();
  const form = useForm<z.infer<typeof forgotPasswordDialogSchema>>({
    resolver: zodResolver(forgotPasswordDialogSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof forgotPasswordDialogSchema>) {
    if (isButtonActive) {
      formContext?.onSubmit(data);
      setIsButtonActive(false);
      setTimeout(() => {
        setIsButtonActive(true);
      }, waitDuration);
    } else {
      setError(
        `Please wait ${waitDuration / 1000} seconds before trying again.`,
      );
      setSuccess(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogBody>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {success && (
            <Alert variant={"success"} className={"my-4"}>
              <AlertDescription>
                A password reset link was sent to the email address if an
                account exists!
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant={"destructive"} className={"my-4"}>
              <AlertTitle>{error}</AlertTitle>
              <AlertDescription></AlertDescription>
            </Alert>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogCloseButton />
          <Button type={"submit"}>Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
