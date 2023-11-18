import {ReactElement} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {CaretSortIcon} from "@radix-ui/react-icons";

export default function CollapsableRawData ({data, children}: {data: any, children: ReactElement}) {
  return (
      <Collapsible>
        <CollapsibleTrigger>
          <Button variant="ghost" size="lg">
            {children}
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent >{JSON.stringify(data, null, 2)}</CollapsibleContent>
      </Collapsible>
  );
}