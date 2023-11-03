import React, {Dispatch, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Database, Employee, Role, Sale, Tables} from "@/lib/database.types";
import {DialogClose} from "@radix-ui/react-dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {getSupabaseBrowserClient} from "@/lib/supabase";


export interface EmployeeSelectModalFormProps {
  sale: Sale
  updateSale: (sale: Sale) => void
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}

// todo duplicate and should be saleFormSchema?
const employeeFormSchema = z.object({
  EmployeeID:
      z.string().min(1, {
        message: "EmployeeID must not be empty."})
          .max(255, {
            message: "EmployeeID must be shorter than 255 characters."}),

  VehicleMake:z.string().min(1, {
    message: "VehicleMake must not be empty."})
      .max(255, {
        message: "VehicleMake must be shorter than 255 characters."}),

  ActualCashValue:
      z.number().min(1, {
        message: "ActualCashValue must not be empty."})
          .max(255, {
            message: "ActualCashValue must be shorter than 255 characters."}),

    GrossProfit: z.number().min(1, {
        message: "GrossProfit must not be empty."})
            .max(255, {
            message: "GrossProfit must be shorter than 255 characters."}),

    FinAndInsurance: z.number().min(1, {
        message: "FinanceProfit must not be empty."})
            .max(255, {
            message: "FinanceProfit must be shorter than 255 characters."}),

    Holdback: z.number().min(1, {
        message: "Holdback must not be empty."})
            .max(255, {
            message: "Holdback must be shorter than 255 characters."}).optional(),
    Total: z.number().min(1, {
        message: "Total must not be empty."})
            .max(255, {
            message: "Total must be shorter than 255 characters."}),
    StockNumber: z.string().min(1, {
        message: "StockNumber must not be empty."})
            .max(255, {
            message: "StockNumber must be shorter than 255 characters."}),

    CustomerID: z.number().min(1, {
        message: "CustomerNumber must not be empty."})
            .max(255, {
            message: "CustomerNumber must be shorter than 255 characters."}),

    FinancingID: z.number().min(1, {
        message: "FinancingID must not be empty."})
            .max(255, {
            message: "FinancingID must be shorter than 255 characters."}).optional(),

    TradeInID: z.number().min(1, {
        message: "TradeInID must not be empty."})
            .max(255, {
            message: "TradeInID must be shorter than 255 characters."}).optional(),
    NewSales: z.boolean(),
    LotPack: z.number().min(1, {
        message: "LotPack must not be empty."})
            .max(255, {
            message: "LotPack must be shorter than 255 characters."}).optional(),
    DaysInStock: z.number().min(1, {
        message: "DaysInStock must not be empty."})
            .max(255, {
            message: "DaysInStock must be shorter than 255 characters."}).optional(),
    DealerCost: z.number().min(1, {
        message: "DealerCost must not be empty."})
            .max(255, {
            message: "DealerCost must be shorter than 255 characters."}).optional(),
    ROI: z.number().min(-100, {
        message: "ROI must not be empty."})
            .max(100, {
            message: "ROI must be between -100 and 100 percent"}).optional(),

})

// todo database calls update
/**
 * Component used to render adding a new sale on the sales page.
 * @group React Components
 */
export function AddSalesRowDialog({ sale, setShowDialog, updateSale }: EmployeeSelectModalFormProps) {
  const [editState, setEditState] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      EmployeeID: sale?.EmployeeID ?? "",
        VehicleMake: sale?.VehicleMake ?? 0,
        ActualCashValue: sale?.ActualCashValue ?? 0,
        GrossProfit: sale?.GrossProfit ?? 0,
        FinAndInsurance: sale?.FinAndInsurance ?? 0,
        Holdback: sale?.Holdback ?? 0,
        Total: sale?.Total ?? 0,
        StockNumber: sale?.StockNumber ?? 0,
        CustomerID: sale?.CustomerID ?? 0,
        FinancingID: sale?.FinancingID ?? 0,
        TradeInID: sale?.TradeInID ?? 0,
        NewSales: sale?.NewSale ?? false,
        LotPack: sale?.LotPack ?? 0,
        DaysInStock: sale?.DaysInStock ?? 0,
        DealerCost: sale?.DealerCost ?? 0,
        ROI: sale?.ROI ?? 0,
    },
  })
    // console.log("sale:", sale)

  async function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    try {

      const { data: data, error} = await supabase
          .from('Sales').update(
              {
                    EmployeeID: values.EmployeeID,
                    VehicleMake: values.VehicleMake,
                    ActualCashValue: values.ActualCashValue,
                    GrossProfit: values.GrossProfit,
                    FinAndInsurance: values.FinAndInsurance,
                    Holdback: values.Holdback,
                    Total: values.Total,
                    StockNumber: values.StockNumber,
                    CustomerID: values.CustomerID,
                    FinancingID: values.FinancingID,
                    TradeInID: values.TradeInID,
                    NewSales: values.NewSales,
                    LotPack: values.LotPack,
                    DaysInStock: values.DaysInStock,
                    DealerCost: values.DealerCost,
                    ROI: values.ROI,
              }
          ).eq('id', sale.id).select()
        console.log(data)

      if (error) {
        console.log("Supabase error: ", error);
        throw new Error("An error occurred while updating the employee record.");
      }

      data && updateSale(data[0]); // todo this should throw an error not conditional
    } catch (error) {
      console.log(error)
    } finally {
      setShowDialog(false);
    }
  }


  return (
      <ScrollArea className='flex flex-col max-h-[700px] text-foreground pr-4 '>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogBody className={'space-y-4'}>



                      <FormField
                          control={form.control}
                          name="EmployeeID"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Employee ID</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="EmployeeID"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="VehicleMake"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Vehicle Make</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="VehicleMake"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="GrossProfit"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Gross Profit</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="FinAndInsurance"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Finance and Insurance</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="Holdback"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Hold Back</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="Total"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Total</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="StockNumber"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Stock Number</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="CustomerID"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Customer ID</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="FinancingID"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Financing ID</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="TradeInID"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Trade In ID</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="NewSales"
                          render={({ field }) => (
                              <FormItem >
                                  <FormControl >
                                    <div className={'flex items-center gap-2'}>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FormLabel>New Sale</FormLabel>
                                    </div>
                                  </FormControl>

                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="LotPack"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Lot Pack</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="DaysInStock"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Days In Stock</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="DealerCost"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Cost</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="ROI"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>ROI</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="0"
                                          {...field}
                                          disabled={!editState}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />


                  </DialogBody>
                  <DialogFooter className={'py-4'}>
                      {editState ? (
                          <Button type={"submit"}>Submit</Button>
                      ) : (
                          <Button
                              variant="destructive"
                              type="button"
                              onClick={() =>
                                  setTimeout(() => {
                                      setEditState(true);
                                  }, 10)
                              }
                          >
                              Edit
                          </Button>
                      )}
                      <DialogClose asChild>
                          <Button type="button" variant="secondary">
                              Close
                          </Button>
                      </DialogClose>
                  </DialogFooter>
              </form>
          </Form>
          <ScrollBar />
      </ScrollArea>
  )
}
