import FormModal, {FormModalProps, useFormModalContext} from "@/components/FormModal";
import {Meta, StoryObj} from "@storybook/react";
import {useArgs} from "@storybook/preview-api";
import React, {Dispatch, SetStateAction} from "react";
import {Button} from "@/components/ui/button";
import {CreateRoleDialog} from "@/components/CreateRoleDialog";
import {fireEvent, screen, userEvent, within} from "@storybook/testing-library";

export default {
  title: 'Dialogs/Create Role',
  component: FormModal,
  parameters: {
    layout: "centered"
  },
  args: {
    showDialog: true,
  },
} as Meta;


export const Default: StoryObj<FormModalProps> = {
  render: function Render(args){
    const [{showDialog}, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({showDialog: value})
    }
    const modalControls = {showDialog: showDialog,
      setShowDialog: setShowDialog as Dispatch<SetStateAction<boolean>>}

    return (
      <>
        <Button onClick={() => setShowDialog(true)}>Trigger</Button>
        <FormModal
            {...args}
            {...modalControls}
            title={"Create Custom Role"}
        >
          <CreateRoleDialog/>
        </FormModal>
      </>
    )
  },
}

export const SimulateCreation: StoryObj<FormModalProps> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement); // todo
    let trigger;
    // open dialog if not open already
    if ((trigger = canvas.getByText("Trigger")) && !screen.queryByText("Create Custom Role")) {
      await  userEvent.click(trigger, {delay:100})
    }

    // screen.


    // submit form
    const submitButton = screen.getByText("Submit")
    fireEvent.click(submitButton)
  }
}