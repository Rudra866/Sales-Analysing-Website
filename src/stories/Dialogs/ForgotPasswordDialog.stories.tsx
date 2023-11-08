import FormModal, {FormModalProps, useFormModalContext} from "@/components/FormModal";
import {Meta, StoryObj} from "@storybook/react";
import {useArgs} from "@storybook/preview-api";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

import ForgotPasswordDialog, {ForgotPasswordDialogProps} from "@/components/ForgotPasswordDialog";
import {screen, userEvent} from "@storybook/testing-library";
import {withTests} from "@storybook/addon-jest";
import results from "../../../.jest-test-results.json";
import {useTestDialogControls} from "@/stories/Dialogs/useDialogArgs";

// todo submit success simulation doesn't work but works in implementation

const delay = 100;

export default {
  title: 'Dialogs/Forgotten Password',
  component: FormModal,
  decorators: [withTests({ results })],
  parameters: {
    layout: "centered"
  },
  args: {
    showDialog: true,
    title: "Request Password Reset",
  },
} as Meta;

type TestProps = FormModalProps & ForgotPasswordDialogProps
type Story = StoryObj<TestProps>

const RenderTemplate = {
  render: function Render(args: TestProps){
    const [{success, error}, updateArgs] = useArgs();
    const setError = (value: string | null) => {
      updateArgs({error: value})
    }
    const setSuccess = (value: boolean) => {
      updateArgs({success: value})
    }

    const modalControls = useTestDialogControls();
    return (
        <>
          <Button onClick={() => modalControls.setShowDialog(true)}>Trigger</Button>
          <FormModal {...args} {...modalControls} >
            <ForgotPasswordDialog
                success={success}
                error={error}
                setError={setError as unknown as Dispatch<SetStateAction<string | null>>}
                setSuccess={setSuccess as unknown as Dispatch<SetStateAction<boolean>>}
            />
          </FormModal>
        </>
    )
  },
}

export const Default: Story = {
  ...RenderTemplate
}

export const OnSuccess: Story = {
  ...RenderTemplate,
  args: {
    success: true,
    error: null
  }
}

export const OnError: Story = {
  ...RenderTemplate,
  args: {
    success: false,
    error: "Email rate exceeded."
  }
}

export const SimulateSubmit: Story = {
  ...RenderTemplate,
  play: async () => {
    const user = userEvent.setup({delay});
    const emailField = screen.getByPlaceholderText("Email")
    await user.type(emailField, "abc123@usask.ca")

    const submitButton = screen.getByText("Submit");
    await user.click(submitButton)
  }
}

