import FormModal, { FormModalProps } from "@/components/dialogs/form-modal";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { CreateRoleDialog } from "@/components/dialogs/create-role-dialog";
import { useTestDialogControls } from "@/stories/Dialogs/useDialogArgs";

export default {
  title: "Dialogs/Create Role",
  component: FormModal,
  parameters: {
    layout: "centered",
  },
  args: {
    showDialog: true,
    title: "Create Custom Role",
  },
} as Meta;

export const Default: StoryObj<FormModalProps> = {
  render: function Render(args) {
    const modalControls = useTestDialogControls();
    return (
      <>
        <Button onClick={() => modalControls.setShowDialog(true)}>
          Trigger
        </Button>
        <FormModal {...args} {...modalControls}>
          <CreateRoleDialog />
        </FormModal>
      </>
    );
  },
};

// export const SimulateCreation: StoryObj<FormModalProps> = {
//   render: function Render(args){
//     const modalControls = useTestDialogControls();
//     return (
//         <>
//           <Button onClick={() => modalControls.setShowDialog(true)}>Trigger</Button>
//           <FormModal {...args} {...modalControls}>
//             <CreateRoleDialog/>
//           </FormModal>
//         </>
//     )
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement); // todo
//     let trigger;
//     // open dialog if not open already
//     if ((trigger = canvas.getByText("Trigger")) && !screen.queryByText("Create Custom Role")) {
//       await  userEvent.click(trigger, {delay:100})
//     }
//
//     // screen.
//
//
//     // submit form
//     const submitButton = screen.getByText("Submit")
//     fireEvent.click(submitButton)
//   }
// }
