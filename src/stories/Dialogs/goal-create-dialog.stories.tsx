import FormModal, { FormModalProps } from "@/components/dialogs/form-modal";
import GoalCreateDialog from "@/components/dialogs/goal-create-dialog";
import { Meta } from "@storybook/react";
import { test_employee_set, test_roles_set } from "@/tests/test_data";
import { useTestDialogControls } from "@/stories/Dialogs/useDialogArgs";
import { Button } from "@/components/ui/button";
import React from "react";

export default {
  title: "Dialogs/Goal Dialog",
  component: GoalCreateDialog,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "",
  },
} as Meta;

export type CustomGoalCreateDialogProps = FormModalProps;

const Template = {
  render: function Render(args: CustomGoalCreateDialogProps) {
    const modalControls = useTestDialogControls();
    return (
      <>
        <Button onClick={() => modalControls.setShowDialog(true)}>
          Trigger
        </Button>
        <FormModal
          {...args}
          {...modalControls}
          onSubmit={(data) => console.log(data)}
        >
          <GoalCreateDialog goal={null} {...args} />
        </FormModal>
      </>
    );
  },
};

export const Default = {
  ...Template,
  args: {
    roles: test_roles_set,
    employee: test_employee_set[0],
  },
};
