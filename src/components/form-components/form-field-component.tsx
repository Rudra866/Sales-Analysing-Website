import React from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Textarea} from "@/components/ui/textarea";

type FormFieldComponentProps = {
    name: string
    form: any
    label?: string
    inputType: "input" | "checkbox" | "inputNumber" | "textarea"
    className?: string
}


export default function FormFieldComponent({name, form, label, inputType, className}: FormFieldComponentProps) {
    return (
        <div className={className}>
            <FormField
                control={form.control}
                name={name}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl className='flex flex-col'>
                            {inputType === "input" ? (
                                <Input
                                    placeholder={label}
                                    {...field}
                                />
                            ) : inputType === "inputNumber" ? (
                                <Input
                                    placeholder={label}
                                    {...field}
                                    onChange={event => {
                                        const value = parseFloat(event.target.value);
                                        field.onChange(value);
                                    }}
                                />
                            ) : inputType === "checkbox" ? (
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(event) => {
                                        field.onChange(event)
                                    }}
                                />
                            ) : inputType === "textarea" ? (
                                <Textarea
                                    className='h-64'
                                    placeholder={'Enter text here...'}
                                    defaultValue={label}
                                    {...field}
                                />
                            ) : (
                                <Input
                                    placeholder={label}
                                    {...field}
                                />
                            )
                            }
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </div>
    );
}
