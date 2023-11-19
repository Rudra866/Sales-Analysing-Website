import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import React from "react";

export default function tableTooltip(cell:string){
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className={'max-w-[200px] text-sm truncate'}>
                        {cell}
                    </p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{cell}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
