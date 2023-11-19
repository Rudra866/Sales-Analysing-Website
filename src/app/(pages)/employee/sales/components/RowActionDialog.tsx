import React, {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Button} from "@/components/ui/button";
import {Sale} from "@/lib/database";
import {DialogClose} from "@radix-ui/react-dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useFormModalContext} from "@/components/dialogs/FormModal";
import FormFieldComponent from "@/components/form-components/form-field-component";
import {Separator} from "@/components/ui/separator";

export interface SaleSelectModalFormProps {
    sale?: Sale | null
}


const saleFormSchemaCommon = {
    StockNumber: z.string().min(1, {message: "StockNumber must not be empty."}),
    VehicleMake: z.string().min(1, {message: "VehicleMake must not be empty."}),
    CustomerName: z.string().nonempty("Customer Name must not be empty."),
    CustomerCity: z.string().nonempty("Customer City must not be empty."),
    ActualCashValue: z.number(),
    GrossProfit: z.number(),
    FinAndInsurance: z.number(),
    TradeInID: z.number().optional(),
    NewSale: z.boolean(),
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
export function RowActionDialog({sale}: SaleSelectModalFormProps) {
    const formContext = useFormModalContext();
    const [newSalesCheck, setNewSalesCheck] = useState<boolean>(sale?.NewSale || false)
    const form = useForm<z.infer<typeof saleFormSchema>>(
            {
                resolver: zodResolver(saleFormSchema),
                defaultValues: {
                    ActualCashValue: sale?.ActualCashValue ?? 0,
                    DaysInStock: sale?.DaysInStock ?? 0,
                    DealerCost: sale?.DealerCost ?? 0,


                    FinAndInsurance: sale?.FinAndInsurance ?? 0,
                    GrossProfit: sale?.GrossProfit ?? 0,
                    Holdback: sale?.Holdback ?? 0,
                    LotPack: sale?.LotPack ?? 0,
                    NewSale: sale?.NewSale ?? false,

                    ROI: sale?.ROI ?? 0,
                    StockNumber: sale?.StockNumber ?? "",
                    VehicleMake: sale?.VehicleMake ?? "",
                    TradeInID: sale?.TradeInID ?? 0,
                },
            }

    )
    type formFieldComponentsPropType =
        {
            name: string,
            form: typeof form,
            label: string,
            className: string,
            inputType: "input" | "inputNumber" | "textarea" | "checkbox",
            hidden?: boolean
        }[]

    const formFieldComponentsProps: formFieldComponentsPropType = [
        {
            name: 'StockNumber',
            form: form,
            label: 'Stock Number',
            className: 'col-span-4',
            inputType: 'input',
        },
        {
            name: 'VehicleMake',
            form: form,
            label: 'Vehicle Make',
            className: 'col-span-2',
            inputType: 'input',
        },
        {
            name: 'ActualCashValue',
            form: form,
            label: 'Actual Cash Value',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
        {
            name: 'GrossProfit',
            form: form,
            label: 'Gross Profit',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
        {
            name: 'FinAndInsurance',
            form: form,
            label: 'F&I',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
        {
            name: 'Holdback',
            form: form,
            label: 'Hold Back',
            className: 'col-span-2',
            inputType: 'inputNumber',
            hidden: newSalesCheck
        },
    ];

    const formFieldComponentsProps2: formFieldComponentsPropType = [
        {
            name:'CustomerName',
            form: form,
            label: 'Customer Name',
            className: 'col-span-2',
            inputType: 'input',
        },
        {
            name:'CustomerCity',
            form: form,
            label: 'City',
            className: 'col-span-2',
            inputType: 'input',
        },
        {
            name:'TradeIn',
            form: form,
            label: 'Trade-in Name',
            className: 'col-span-2',
            inputType: 'input',
        },
        {
            name:'FinancingMethod',
            form: form,
            label: 'Financing Method',
            className: 'col-span-2',
            inputType: 'input',
        }];

    const formFieldComponentsProps3: formFieldComponentsPropType = [
        {
            name: 'LotPack',
            form: form,
            label: 'Lot Pack',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
        {
            name: 'DaysInStock',
            form: form,
            label: 'Days In Stock',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
        {
            name: 'DealerCost',
            form: form,
            label: 'Dealer Cost',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
        {
            name: 'ROI',
            form: form,
            label: 'ROI',
            className: 'col-span-2',
            inputType: 'inputNumber',
        },
    ]

    return (
        <ScrollArea className='flex flex-col max-h-[700px] text-foreground pr-4 '>
            <Form {...form}>
                <form onSubmit={form.handleSubmit((data) =>
                    formContext?.onSubmit(data))}>
                    <DialogBody className={'grid grid-cols-4 gap-2'}>
                        {formFieldComponentsProps.map((props, index) => (
                            !props.hidden && <FormFieldComponent
                                key={props.name + index}
                                name={props.name}
                                form={props.form}
                                label={props.label}
                                className={props.className}
                                inputType={props.inputType}
                            />
                        ))}
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
                                                    const checkValue = event.valueOf();
                                                    if (typeof checkValue === "boolean") {
                                                        setNewSalesCheck(checkValue)
                                                    }
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
                        {formFieldComponentsProps2.map((props, index) => (
                                <FormFieldComponent
                                    key={props.name + index}
                                    name={props.name}
                                    form={props.form}
                                    label={props.label}
                                    className={props.className}
                                    inputType={props.inputType}
                                />
                            ))
                        }

                        {newSalesCheck && (
                            <>
                                <Separator className={'col-span-4 my-4'} />
                                {formFieldComponentsProps3.map((props, index) => (
                                    <FormFieldComponent
                                        key={props.name + index}
                                        name={props.name}
                                        form={props.form}
                                        label={props.label}
                                        className={props.className}
                                        inputType={props.inputType}
                                    />
                                ))}
                            </>
                        )}


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
