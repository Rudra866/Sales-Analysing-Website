import {
  RoleSelectDialog,
  RoleSelectModalFormProps,
} from "@/components/dialogs/role-select-dialog";
import FormModal, { FormModalProps } from "@/components/dialogs/form-modal";
import { test_employee_set, test_roles_set } from "@/tests/test_data";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import results from "../../../.jest-test-results.json";
import { withTests } from "@storybook/addon-jest";
import { useTestDialogControls } from "@/stories/Dialogs/useDialogArgs";

type RoleSelectModalCustomArgs = FormModalProps & RoleSelectModalFormProps;
type Story = StoryObj<RoleSelectModalCustomArgs>;

export default {
  title: "Dialogs/Role Form",
  component: RoleSelectDialog,
  decorators: [withTests({ results })],
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Role Selection",
    showDialog: true,
  },
  argTypes: {
    employee: {
      options: ["Employee1", "Employee2", "Employee3"],
      mapping: {
        Employee1: test_employee_set[0],
        Employee2: test_employee_set[1],
        Employee3: test_employee_set[2],
      },
    },
    roles: {
      // todo defaults for changing
      options: ["One Role", "Three Roles", "All Roles"],
      mapping: {
        "One Role": [test_roles_set[0]],
        "Three Roles": test_roles_set.slice(0, 3),
        "All Roles": test_roles_set,
      },
    },
    onSubmit: {
      // need this here only because argTypes is being overridden
      action: "clicked",
    },
  },
} as Meta;

const Template = {
  render: function Render(args: RoleSelectModalCustomArgs) {
    const modalControls = useTestDialogControls();
    return (
      <>
        <Button onClick={() => modalControls.setShowDialog(true)}>
          Trigger
        </Button>
        <FormModal {...args} {...modalControls}>
          <RoleSelectDialog {...args} />
        </FormModal>
      </>
    );
  },
};

export const Default: Story = {
  ...Template,
  args: {
    roles: test_roles_set,
    employee: test_employee_set[0],
  },
};
