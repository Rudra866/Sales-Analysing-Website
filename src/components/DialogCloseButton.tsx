import {Button} from "@/components/ui/button";
import {DialogClose} from "@radix-ui/react-dialog";

// add text/button props in ?
const DialogCloseButton = () => (
    <DialogClose asChild>
      <Button type="button" variant="secondary">
        Cancel
      </Button>
    </DialogClose>
)

export default DialogCloseButton;