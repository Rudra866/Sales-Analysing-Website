// todo -- broken fields time
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogFooter} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Employee} from "@/lib/database";
import {DialogClose} from "@radix-ui/react-dialog";
import {useFormModalContext} from "@/components/dialogs/FormModal";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {CalendarIcon, CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils"
import useAuth from "@/hooks/use-auth";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Label} from "@/components/ui/label";
// todo unverified fields
const newTaskSchema = z.object({
  Name: z.string(),
  Description: z.string(),
})



/**
 * Component to allow for viewing a user's details and modifying them. Has two states, view mode and edit mode.
 * Maybe add a toast notification here in the future so the user has more evidence it was successful?
 * @param {EmployeeSelectModalFormProps} props
 * @group React Components
 */
export function TaskCreateDialog({employees}: { employees: Employee[] }) {
  const [openEmployees, setOpenEmployees] = useState<boolean>(false)
  const [employeeValue, setEmployeeValue] = React.useState("")
  const formContext = useFormModalContext()
  const {employee} = useAuth();

  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const form = useForm<z.infer<typeof newTaskSchema>>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      Name: "",
      Description: "",
    },
  })
  function onSubmit(data: any) {
    console.log(employeeValue)
    console.log(employees.find(employee => employee.Name.toLowerCase() === employeeValue)?.id)
    data["Creator"] = employee?.id;
    data["Assignee"] = employees.find((employee) => employee.Name.toLowerCase() === employeeValue)?.id // todo @bill better way to do this with keys?
    data["StartDate"] = startDate;
    data["EndDate"] = endDate;

    formContext!.onSubmit(data)
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DialogBody>
            <FormField
                control={form.control}
                name="Name"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>EmployeeNumber</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Task Name"
                            {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="Description"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                            placeholder="Employee Name"
                            {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
            <div>
              <Label>Start Date </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant={"outline"}
                      className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                      )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant={"outline"}
                      className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                      )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Popover open={openEmployees} onOpenChange={setOpenEmployees}>
              <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    // aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                  {employeeValue
                      ? employees.find((employee) => employee.Name.toLowerCase() === employeeValue)?.Name
                      : "Select Employee"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] h-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search employees..." className="h-9"/>
                  <CommandEmpty>No Employee</CommandEmpty>
                  <CommandGroup className={"overflow-scroll"}>
                    {employees.map((employee) => (
                        <CommandItem
                            key={employee.id}
                            value={employee.Name}
                            onSelect={(currentValue) => {
                              setEmployeeValue(currentValue === employeeValue ? "" : currentValue)
                              setOpenEmployees(false)
                            }}
                        >
                          {employee.Name}
                          <CheckIcon
                              className={cn(
                                  "ml-auto h-4 w-4",
                                  employeeValue === employee.Name.toLowerCase() ? "opacity-100" : "opacity-0"
                              )}
                          />
                        </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
      </Form>);
}
