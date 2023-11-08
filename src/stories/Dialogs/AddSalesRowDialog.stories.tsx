import {StoryObj} from "@storybook/react";
import {AddSalesRowDialog, SaleSelectModalFormProps} from "@/app/(pages)/sales/components/AddSalesRowDialog";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {test_sales_set} from "@/stories/test_data";
import {Button} from "@/components/ui/button";
import {useTestDialogControls} from "@/stories/Dialogs/useDialogArgs";

type TestProps = SaleSelectModalFormProps & FormModalProps
type Story = StoryObj<TestProps>

const meta = {
  title: 'Dialogs/Sale Form',
  component: AddSalesRowDialog,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: {
      action: true
    },
  },
  render: function Render(args: TestProps) {
    const modalControls = useTestDialogControls();
    return (
        <>
          <Button onClick={() => modalControls.setShowDialog(true)}>Trigger</Button>
          <FormModal {...modalControls} {...args}>
            <AddSalesRowDialog sale={args.sale}/>
          </FormModal>
        </>
    )
  }
}
export default meta;

export const Default: Story = {
  args: {
    showDialog: true,
    sale: test_sales_set[0]
  },
};

export const Empty: Story = {
  args: {
    showDialog: true,
    sale: null
  },
};