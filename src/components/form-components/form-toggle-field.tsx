import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Switch} from "@/components/ui/switch";
import {Input} from "@/components/ui/input";


// todo: add proper types

type RoleDialogOptionProps = {
    label: string,
    name: string,
    description: string,
    form: any
}


export function FormToggleField({label, name, description, form}: RoleDialogOptionProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5 ">
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>
                            {description}
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-readonly
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}


