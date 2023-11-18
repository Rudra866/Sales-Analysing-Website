
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

type FormInputFieldProps = {
    form: any,
    name: "number" | "name" | "email" | "password",
    label: string
}

export const FormInputField = ({form, name, label}: FormInputFieldProps) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        value={field.value}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)
