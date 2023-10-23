import * as React from 'react';
import { DateTime } from 'luxon';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {DateRange, SelectSingleEventHandler} from 'react-day-picker';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
// import {addDays} from "date-fns";


interface DateTimePickerProps {
    date: Date;
    setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
    // const [date, setDate] = React.useState<DateRange | undefined>({
    //     from: new Date(2023, 0, 20),
    //     to: addDays(new Date(2023, 0, 20), 20),
    // })

    const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime>(
        DateTime.fromJSDate(date)
    );

    const handleSelect: SelectSingleEventHandler = (day, selected) => {
        const selectedDay = DateTime.fromJSDate(selected);
        const modifiedDay = selectedDay.set({
            hour: selectedDateTime.hour,
            minute: selectedDateTime.minute,
        });

        setSelectedDateTime(modifiedDay);
        setDate(modifiedDay.toJSDate());
    };

    const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { value } = e.target;
        const hours = Number.parseInt(value.split(':')[0] || '00', 10);
        const minutes = Number.parseInt(value.split(':')[1] || '00', 10);
        const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });

        setSelectedDateTime(modifiedDay);
        setDate(modifiedDay.toJSDate());
    };

    const footer = (
        <>
            <div className="px-4 pt-0 pb-4">
                <Label>Time</Label>
                <Input
                    type="time"
                    onChange={handleTimeChange}
                    value={selectedDateTime.toFormat('HH:mm')}
                />
            </div>
            {!selectedDateTime && <p>Please pick a day.</p>}
        </>
    );

    return (
        <Popover>
            <PopoverTrigger asChild className="z-10">
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        selectedDateTime.toFormat('DDD HH:mm')
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDateTime.toJSDate()}
                    onSelect={handleSelect}
                    initialFocus
                />
                {footer}
            </PopoverContent>
        </Popover>
    );
}
