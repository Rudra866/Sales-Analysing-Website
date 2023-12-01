'use client';

import * as React from "react"
import {CheckIcon, PlusCircledIcon} from "@radix-ui/react-icons"
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Separator} from "@/components/ui/separator"
import {LucideIcon, X} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {useEffect, useMemo} from "react";

interface DataTableFacetedFilterProps {
    title?: string
    options: {label: string, value: string}[] | undefined
}


export function DataTableFacetedFilter({title, options}: DataTableFacetedFilterProps) {
    const [selectedValues, setSelectedValues] = React.useState<string[]>([])

    return (
        <Popover>
            <PopoverTrigger asChild>

                <Button variant="outline" size="sm" className="flex flex-wrap w-fit h-fit justify-start border-dashed p-1 gap-1">
                    <PlusCircledIcon className="mr-2 h-4 w-4"/>
                    {title}
                    {selectedValues?.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="hidden md:flex mx-2 h-4" />
                            <div className="space-x-1 space-y-1 flex flex-wrap items-end">
                                {options && options
                                    .filter((option) => selectedValues.includes(option.value))
                                    .map((option) =>
                                        <Badge variant="secondary" key={option.value} className="z-40 rounded-full px-2 font-normal h-full">
                                            {option.label}
                                            <X size={18} className="ml-1 rounded-full cursor-pointer hover:bg-primary/80" onClick={() => {
                                                setSelectedValues(selectedValues.filter((value) => value !== option.value))
                                            }}/>
                                        </Badge>
                                    )
                                }
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-full p-0 " align="start">
                <Command>
                    <CommandInput placeholder={title} className={'focus:border-background  border-0'}/>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options && options.map((option) => {
                                const isSelected = selectedValues.includes(option.value)
                                return (
                                    <CommandItem
                                        className={cn('  ', )}
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {setSelectedValues(selectedValues.filter((value) => value !== option.value))
                                            } else {setSelectedValues([...selectedValues, option.value])}
                                            // console.log('isSelected: ', isSelected, option.value, ' selectedValues: ', selectedValues)
                                        }}
                                    >
                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-slate-700/50 text-white")}
                                        >
                                            <Checkbox checked={isSelected} className={'h-4 w-4'}/>
                                        </div>
                                        <Label className={'text-slate-700'}>{option.label}</Label>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>

                        {selectedValues.length > 0 && (
                            <>
                                <CommandSeparator className={'bg-white/75'}/>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            setSelectedValues([])
                                        }}
                                        className="justify-center text-center text-slate-700 hover:text-slate-900"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
