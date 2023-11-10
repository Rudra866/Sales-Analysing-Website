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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export interface SaleSelectModalFormProps {
    sale?: Sale | null
}


const saleFormSchemaCommon = {
    StockNumber: z.string().min(1, {
        message: "StockNumber must not be empty."
    })
        .max(255, {
            message: "StockNumber must be shorter than 255 characters."
        }),
    VehicleMake: z.string().min(1, {
        message: "VehicleMake must not be empty."
    })
        .max(255, {
            message: "VehicleMake must be shorter than 255 characters."
        }),

    CustomerName: z.string(), // todo

    ActualCashValue: z.number(), //todo

    GrossProfit: z.number(), //todo

    FinAndInsurance: z.number(), //todo

    FinancingMethod: z.string().optional(), //todo

    UsedSale: z.boolean(), //todo

    TradeIn: z.string().optional(), //todo

    TradeInValue: z.string().optional(), //todo

    EmployeeID: z.string()
}


const saleFormSchema = z.object({
    ...saleFormSchemaCommon,
    Holdback: z.string()
        .transform((value) => {
            const numberValue = parseFloat(value);

            return !isNaN(numberValue) ? numberValue : value;
        }),
})

const usedSaleFormSchema = z.object({
    ...saleFormSchemaCommon,

    LotPack: z.number(),
    DaysInStock: z.number(),
    DealerCost: z.number(),
    ROI: z.number().min(-100, {
        message: "ROI must not be empty."
    })
        .max(100, {
            message: "ROI must be between -100 and 100 percent"
        }),

})

// todo database calls update
// todo need customer && trade-in && financiers.
/**
 * Component used to render adding a new sale on the sales page.
 * @group React Components
 */
export function AddTasksRowDialog({sale}: SaleSelectModalFormProps) {
    const supabase = getSupabaseBrowserClient();
    const formContext = useFormModalContext();
    const [editState, setEditState] = useState(false);
    const [newSaleSelection, setNewSaleSelection] = useState<boolean>()
    const [noFinancing, setNoFinancing] = useState<boolean>(!!sale?.FinancingID)
    const [noTradeIn, setNoTradeIn] = useState<boolean>(!!sale?.TradeInID)
    const [employees, setEmployees] = useState<Employee[]>([])

    const form = useForm<z.infer<typeof saleFormSchema | typeof usedSaleFormSchema>>(
        newSaleSelection ?
            {
                resolver: zodResolver(saleFormSchema),
                defaultValues: {
                    StockNumber: sale?.StockNumber ?? "",
                    VehicleMake: sale?.VehicleMake ?? "",
                    ActualCashValue: sale?.ActualCashValue ?? 0,
                    GrossProfit: sale?.GrossProfit ?? 0,
                    FinAndInsurance: sale?.FinAndInsurance ?? 0,
                    Holdback: sale?.Holdback ?? 0, // new only
                    UsedSale: !sale?.NewSale ?? false,
                    EmployeeID: sale?.EmployeeID ?? "",
                },
            }
            :
            {
                resolver: zodResolver(usedSaleFormSchema),
                defaultValues: {
                    StockNumber: sale?.StockNumber ?? "",
                    VehicleMake: sale?.VehicleMake ?? "",
                    ActualCashValue: sale?.ActualCashValue ?? 0,
                    GrossProfit: sale?.GrossProfit ?? 0,
                    FinAndInsurance: sale?.FinAndInsurance ?? 0,
                    UsedSale: !sale?.NewSale ?? false,
                    LotPack: sale?.LotPack ?? 0,
                    DaysInStock: sale?.DaysInStock ?? 0,
                    DealerCost: sale?.DealerCost ?? 0,
                    ROI: sale?.ROI ? sale.ROI * 100 : 0,
                    EmployeeID: sale?.EmployeeID ?? "",
                },
            }
    )


    useEffect(() => {
        getAllEmployees(supabase).then((employees) => {
            setEmployees(employees as Employee[])
        })
    }, []);

    function getEmployee(): Employee | undefined {
        return employees.find((employee) => employee.id === form.getValues("EmployeeID"))
    }

    function onSubmit(values: z.infer<typeof saleFormSchema | typeof usedSaleFormSchema>) {
        formContext?.onSubmit(values)
        console.log(values)
    }

    return (
        <ScrollArea className='flex flex-col max-h-[700px] text-foreground pr-4 '>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogBody className={'space-y-4'}>
                        <div className={"flex flex-row"}>
                            <FormField
                                control={form.control}
                                name="StockNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Stock Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                className={"w-32"}
                                                placeholder="0"
                                                {...field}
                                                disabled={!editState}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={"flex-grow pl-2"}>
                                <FormField
                                    control={form.control}
                                    name="VehicleMake"
                                    render={({field}) => (
                                        <FormItem className={""}>
                                            <FormLabel>Vehicle Make</FormLabel>
                                            <FormControl>
                                                <Input

                                                    placeholder="VehicleMake"
                                                    {...field}
                                                    disabled={!editState}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="ActualCashValue"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Actual Cash Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ActualCashValue"
                                            {...field}
                                            onChange={event => {
                                                const value = parseFloat(event.target.value);
                                                field.onChange(value);
                                            }}
                                            disabled={!editState}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className={"flex flex-row gap-2"}>
                            <FormField
                                control={form.control}
                                name="GrossProfit"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Gross Profit</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0"
                                                {...field}
                                                onChange={event => {
                                                    const value = parseFloat(event.target.value);
                                                    field.onChange(value);
                                                }}
                                                disabled={!editState}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="FinAndInsurance"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>F&I</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0"
                                                {...field}
                                                onChange={event => {
                                                    const value = parseFloat(event.target.value);
                                                    field.onChange(value);
                                                }}
                                                disabled={!editState}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {newSaleSelection &&
                                <FormField
                                    control={form.control}
                                    name="Holdback"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Hold Back</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={"0"}
                                                    {...field}
                                                    onChange={event => {
                                                        const value = parseFloat(event.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    disabled={!editState}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            }
                        </div>
                        <div className={"flex flex-row gap-2"}>
                            <FormField
                                control={form.control}
                                name="CustomerName"
                                render={({field}) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Customer Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Name"
                                                {...field}
                                                disabled={!editState}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="EmployeeID"
                                render={({field}) => (
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Sales Associate</FormLabel>
                                        <FormControl>
                                            <Select
                                                defaultValue={getEmployee()?.Name ?? field.value}
                                                onValueChange={field.onChange}
                                                disabled={!editState}
                                            >
                                                <SelectTrigger id="area" >
                                                    <SelectValue placeholder={getEmployee()?.Name ?? field.value} {...field}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employees.map((employee) => (
                                                        <SelectItem value={employee.id} key={employee.id}>
                                                            {employee.Name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className={"flex gap-2"}>
                            <FormField
                                control={form.control}
                                name="TradeIn"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Trade-in Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Vehicle Make"
                                                {...field}
                                                disabled={!editState || noTradeIn}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="TradeInValue"
                                render={({field}) => (
                                    <FormItem className={"w-28"}>
                                        <FormLabel>Trade-in Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="$0.00"
                                                {...field}
                                                onChange={event => {
                                                    const value = parseFloat(event.target.value);
                                                    field.onChange(value);
                                                }}
                                                disabled={!editState || noTradeIn}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={"flex flex-row gap-2 items-center pt-4 pl-2"}>
                                <Checkbox
                                    disabled={!editState}
                                    checked={noTradeIn}
                                    onCheckedChange={(event) => {
                                        if (event != "indeterminate") setNoTradeIn(event)
                                    }}/>
                                <FormLabel>No Trade</FormLabel>
                            </div>
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="FinancingMethod"
                                render={({field}) => (
                                    <FormItem className={"flex flex-row"}>
                                        <div className={"grow"}>
                                            <FormLabel>Financing Method</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={noFinancing ? "None" : "Financing"}
                                                    {...field}
                                                    disabled={!editState || noFinancing}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage/>
                                        <div className={"flex flex-row gap-2 items-center pt-4 pl-2"}>
                                            <Checkbox
                                                disabled={!editState}
                                                checked={noFinancing}
                                                onCheckedChange={(event) => {
                                                    if (event != "indeterminate") setNoFinancing(event)
                                                }}/>
                                            <FormLabel>No Financing</FormLabel>
                                        </div>
                                    </FormItem>

                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="UsedSale"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className={'flex items-center gap-2'}>
                                            <Checkbox
                                                disabled={!editState}
                                                checked={field.value}
                                                onCheckedChange={(event) => {
                                                    field.onChange(event)
                                                    setNewSaleSelection(field.value)
                                                }}
                                            />
                                            <FormLabel>Used Sale</FormLabel>
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {!newSaleSelection &&
                            <>
                                <FormField
                                    control={form.control}
                                    name="LotPack"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Lot Pack</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={event => {
                                                        const value = parseFloat(event.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    disabled={!editState}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                <FormField
                                    control={form.control}
                                    name="DaysInStock"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Days In Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={event => {
                                                        const value = parseFloat(event.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    disabled={!editState}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                <FormField
                                    control={form.control}
                                    name="DealerCost"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Dealer Cost</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={event => {
                                                        const value = parseFloat(event.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    disabled={!editState}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                <FormField
                                    control={form.control}
                                    name="ROI"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>ROI</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={event => {
                                                        const value = parseFloat(event.target.value);
                                                        field.onChange(value);
                                                    }}
                                                    disabled={!editState}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            </>}
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
            <ScrollBar/>
        </ScrollArea>
    )
}
