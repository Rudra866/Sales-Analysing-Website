import {Meta, StoryObj} from "@storybook/react";
import {AddSalesRowDialog, SaleSelectModalFormProps} from "@/app/(pages)/sales/components/AddSalesRowDialog";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {test_sales_set} from "@/stories/test_data";
import {useArgs} from "@storybook/preview-api";
import {Dispatch, SetStateAction} from "react";
import {Button} from "@/components/ui/button";


export default {
  title: 'Dialogs/Sale Form',
  component: AddSalesRowDialog,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showDialog: {
      type: "boolean",
      control: {type: "boolean"}
    },
    onSubmit: {
      type: "function",
    },
    setShowDialog: {
      type: "function",
    }
  }
} as Meta;

export const Default: StoryObj<SaleSelectModalFormProps & FormModalProps> = {
  args: {
    showDialog: true,
    sale: test_sales_set[0]
  },
  render: function Render(args) {
    const [{showDialog}, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({showDialog: value})
    }

    return (
        <>
          <Button onClick={() => setShowDialog(true)}>Trigger</Button>
          <FormModal onSubmit={() => {
            return
          }}
                     title={"Add Sale"}
                     setShowDialog={setShowDialog as Dispatch<SetStateAction<boolean>>}
                     showDialog={showDialog}>
            <AddSalesRowDialog sale={args.sale}/>
          </FormModal>
        </>
    )
  }
};