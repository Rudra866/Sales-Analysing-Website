import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Employee,
    Sale,
    getSupabaseBrowserClient,
    getAllEmployees,
} from "@/lib/database";
import {DialogClose} from "@radix-ui/react-dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useFormModalContext} from "@/components/FormModal";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import FormFieldComponent from "@/app/(pages)/sales/components/form-field-component";
import {Separator} from "@/components/ui/separator";
import useAuth from "@/hooks/use-auth";

export interface SaleSelectModalFormProps {
    sale?: Sale | null
}


const saleFormSchemaCommon = {
    StockNumber: z.string().min(1, {message: "StockNumber must not be empty."}),
    VehicleMake: z.string().min(1, {message: "VehicleMake must not be empty."}),
    // CustomerName: z.string(), // todo
    // CustomerID: z.number().optional(),
    ActualCashValue: z.number(),
    GrossProfit: z.number(),
    FinAndInsurance: z.number(),
    // FinancierID: z.number().optional(),
    TradeInID: z.number().optional(),
    EmployeeID: z.string(),
    NewSale: z.boolean(),
    SaleTime: z.string().optional(),
    Total: z.number().optional(),
    FinancingID: z.number().optional(),
    Holdback: z.number().optional(),
    LotPack: z.number().optional(),
    DaysInStock: z.number().optional(),
    DealerCost: z.number().optional(),
    ROI: z.number().optional(),

}


const saleFormSchema = z.object({
    ...saleFormSchemaCommon,
})

// todo database calls update
// todo need customer && trade-in && financiers.
/**
 * Component used to render adding a new sale on the sales page.
 * @group React Components
 */
export function AddSalesRowDialog({sale}: SaleSelectModalFormProps) {

    const formContext = useFormModalContext();
    const {employee} = useAuth()

    const form = useForm<z.infer<typeof saleFormSchema>>(
            {
                resolver: zodResolver(saleFormSchema),
                defaultValues: {
                    ActualCashValue: sale?.ActualCashValue ?? 0,
                    // CustomerID: sale?.CustomerID ?? 0,
                    DaysInStock: sale?.DaysInStock ?? 0,
                    DealerCost: sale?.DealerCost ?? 0,
                    EmployeeID: employee?.id ?? "",
                    // FinancingID: sale?.FinancingID ?? 0,
                    FinAndInsurance: sale?.FinAndInsurance ?? 0,
                    GrossProfit: sale?.GrossProfit ?? 0,
                    Holdback: sale?.Holdback ?? 0,
                    LotPack: sale?.LotPack ?? 0,
                    NewSale: sale?.NewSale ?? false,
                    ROI: sale?.ROI ?? 0,
                    SaleTime: sale?.SaleTime ?? "",
                    StockNumber: sale?.StockNumber ?? "",
                    VehicleMake: sale?.VehicleMake ?? "",
                    TradeInID: sale?.TradeInID ?? 0,
                },
            }

    )


    function onSubmit(values: z.infer<typeof saleFormSchema>) {
        formContext?.onSubmit(values)
    }

    return (
        <ScrollArea className='flex flex-col max-h-[700px] text-foreground pr-4 '>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogBody className={'grid grid-cols-4 gap-2'}>
                        <FormFieldComponent
                            name={'StockNumber'}
                            form={form}
                            label={'Stock Number'}
                            className="col-span-4"
                            inputType={'input'}
                        />
                        <FormFieldComponent name={'VehicleMake'} form={form} label={'Vehicle Make'}
                                            className="col-span-2" inputType={'input'}/>
                        <FormFieldComponent name={'ActualCashValue'} form={form} label={'Actual Cash Value'}
                                            className="col-span-2" inputType='inputNumber'/>
                        <FormFieldComponent name={'GrossProfit'} form={form} label={'Gross Profit'}
                                            className="col-span-2" inputType={'inputNumber'}/>
                        <FormFieldComponent name={'FinAndInsurance'} form={form} label={'F&I'} className="col-span-2"
                                            inputType={'inputNumber'}/>
                        <FormFieldComponent name={'Holdback'} form={form} label={'Hold Back'} className="col-span-2"
                                            inputType='inputNumber'/>
                        <FormField
                            control={form.control}
                            name="NewSale"
                            render={({field}) => (
                                <FormItem className='flex items-center pt-5'>
                                    <FormControl>
                                        <div className={'flex items-center gap-2'}>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(event) => {
                                                    field.onChange(event)
                                                }}
                                            />
                                            <FormLabel>Used Sale</FormLabel>
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Separator className={'col-span-4 my-4'}/>
                        <FormFieldComponent name={'CustomerName'} form={form} label={'Customer Name'}
                                            className="col-span-2" inputType={"input"}/>
                        <FormFieldComponent name={'city'} form={form} label={'City'} className="col-span-2"
                                            inputType='input'/>
                        <FormFieldComponent name={'TradeIn'} form={form} label={'Trade-in Name'} className="col-span-2"
                                            inputType='input'/>
                        <FormFieldComponent name={'FinancingMethod'} form={form} label={'Financing Method'}
                                            className="col-span-2" inputType={'input'}/>
                        <Separator className={'col-span-4 my-4'}/>
                        <FormFieldComponent name={'LotPack'} form={form} label={'Lot Pack'} className="col-span-2"
                                            inputType={'inputNumber'}/>
                        <FormFieldComponent name={'DaysInStock'} form={form} label={'Days In Stock'}
                                            className="col-span-2" inputType={'inputNumber'}/>
                        <FormFieldComponent name={'DealerCost'} form={form} label={'Dealer Cost'} className="col-span-2"
                                            inputType={'inputNumber'}/>
                        <FormFieldComponent name={'ROI'} form={form} label={'ROI'} className="col-span-2"
                                            inputType={'inputNumber'}/>

                    </DialogBody>
                    <DialogFooter className={'py-4'}>
                        <Button type={"submit"}>Submit</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
            <ScrollBar/>
        </ScrollArea>
    )
}
