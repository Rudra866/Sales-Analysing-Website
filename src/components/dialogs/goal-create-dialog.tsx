import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useFormModalContext } from "@/components/dialogs/form-modal";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/use-auth";
import { add } from "date-fns";
import { newGoalSchema } from "@/lib/zod-schemas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// yes we know this dialog sucks
/**
 * Component to allow for viewing a goal and modifying it. Has two states, view mode and edit mode.
 * Maybe add a toast notification here in the future so the user has more evidence it was successful?
 * @group React Components
 */
export default function GoalCreateDialog({ goal }: { goal?: any }) {
  const formContext = useFormModalContext();
  const { employee } = useAuth();

  const form = useForm<z.infer<typeof newGoalSchema>>({
    resolver: zodResolver(newGoalSchema),
    defaultValues: {
      Name: goal?.Name ?? "",
      Description: goal?.Description ?? "",
      StartDate: "current",
      TotalGoal: "0",
    },
  });
  function onSubmit(data: any) {
    data["Creator"] = employee?.id;
    data["StartDate"] =
      data["StartDate"] === "current"
        ? new Date()
        : add(new Date(), { months: 1 });
    formContext!.onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <DialogBody className={"space-y-2 w-full"}>
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Goal Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-44"
                    placeholder="Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="StartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Time</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="current" />
                      </FormControl>
                      <FormLabel>This Month</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="next" />
                      </FormControl>
                      <FormLabel>Next Month</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* startDate */}
          <FormField
            control={form.control}
            name="TotalGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input placeholder="Goal Total" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DialogBody>
        <DialogFooter>
          <Button type={"submit"}>Submit</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
