import {StoryObj} from "@storybook/react";
import {AddSalesRowDialog, SaleSelectModalFormProps} from "@/app/(pages)/sales/components/AddSalesRowDialog";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {test_sales_set} from "@/stories/test_data";
import {Button} from "@/components/ui/button";
import {useTestDialogControls} from "@/stories/Dialogs/useDialogArgs";
import {getSupabaseBrowserClient} from "@/lib/database";
import {z} from "zod";
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

export const TestPost: Story = {
  render: function Render(args: TestProps) {
    const modalControls = useTestDialogControls();
    const supabase = getSupabaseBrowserClient();
    async function onSubmit(data:any) {
      // data["EmployeeID"] = '4ff2a2d7-09a1-4d26-81e1-55fcf9b0f49b'; // replace this with the uuid of current employee
      data["Total"] = 5;

      // @ts-ignore
      // await supabase.rpc("create_new_sale", {sale: data});
      await fetch(`http://localhost:3000/api/sale`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    }


    return (
        <>
          <Button onClick={() => modalControls.setShowDialog(true)}>Trigger</Button>
          <FormModal {...modalControls} {...args} onSubmit={onSubmit}>
            <AddSalesRowDialog sale={args.sale}/>
          </FormModal>
        </>
    )
  },

  args: {
    showDialog: true,
    sale: null
  },
};
