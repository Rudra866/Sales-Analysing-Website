import {Meta, StoryObj} from "@storybook/react";
import {AddSalesRowDialog} from "@/app/(pages)/sales/components/AddSalesRowDialog";
import {Dialog} from "@/components/ui/dialog";


export default {
  title: 'Add Sales Dialog',
  component: AddSalesRowDialog,
  parameters: {
    layout: "centered",
  }
} as Meta;

export const Default: StoryObj<typeof AddSalesRowDialog> = {
  args: {

  },

  render: () => (
      <Dialog>
        <AddSalesRowDialog
            sale={null}
            updateSale=   {()=>{return}}
            setShowDialog={()=>{return}}/>
      </Dialog>
  )
};