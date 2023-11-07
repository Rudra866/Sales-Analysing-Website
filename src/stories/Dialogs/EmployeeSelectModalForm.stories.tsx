import {
  EmployeeSelectModalForm,
  EmployeeSelectModalFormProps
} from "@/app/(pages)/admin/employees/components/EmployeeSelectModalForm";
import {test_employee_set, test_roles_set} from "@/stories/test_data";
import {Meta, StoryObj} from "@storybook/react";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {useArgs} from "@storybook/preview-api";
import {Dispatch, SetStateAction} from "react";
import {fireEvent, userEvent, within} from "@storybook/testing-library";
import {Button} from "@/components/ui/button";
import { screen } from '@storybook/testing-library';
// eslint-disable-next-line storybook/story-exports

const delay = 100
type EmployeeSelectModalCustomArgs = EmployeeSelectModalFormProps & FormModalProps
type Story = StoryObj<EmployeeSelectModalCustomArgs>
const meta: Meta<EmployeeSelectModalCustomArgs> = {
  title: "Dialogs/Employee Form",
  component: EmployeeSelectModalForm,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    showDialog: {
      type: "boolean",
    },
    onSubmit: { action: 'clicked' },
    roles: { // todo defaults for changing
      options: ["One Role", "Three Roles", "All Roles"],
      mapping: {
        "One Role": [test_roles_set[0]],
        "Three Roles": test_roles_set.slice(0,3),
        "All Roles": test_roles_set
      }
    },
    employee: {
      options: ["Employee1", "Employee2", "Employee3"],
      mapping: {
        Employee1: test_employee_set[0],
        Employee2: test_employee_set[1],
        Employee3: test_employee_set[2],
      }
    },
  },
  args: {
    title: "Add / Edit Employee",
    showDialog: true,
    roles: test_roles_set,
  }

}
export default meta;
const Template: Story = {
  render: function Render(args) {
    const [{showDialog}, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({showDialog: value})
    }
    return (
      <>
        <Button onClick={() => setShowDialog(true)}>Trigger</Button>
        <FormModal {...args} showDialog={showDialog}
                   setShowDialog={setShowDialog as Dispatch<SetStateAction<boolean>>}>
          <EmployeeSelectModalForm {...args}/>
        </FormModal>
      </>
    )
  },
};

export const Default: Story = {
  ...Template,
  args: {
  }
}

export const EditEmployee: Story = {
  ...Template,
  args: {
    employee: test_employee_set[0],
    variant: null
  }
}

export const InviteEmployee: Story = {
  ...Template,
  args: {
    variant: "invite"
  }
}

export const RegisterEmployee: Story = {
  ...Template,
  args: {
    variant: "register"
  }
}

export const SimulateEdit: Story = {
  ...Template,
  args: {
    variant: null,
    employee: test_employee_set[1],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement); // todo
    let trigger;
    // open dialog if not open already
    if ((trigger = canvas.getByText("Trigger")) && !screen.queryByText("Edit")) {
      await  userEvent.click(trigger, {delay})
    }

    const editButton = screen.getByText("Edit")
    await userEvent.click(editButton, {delay});
    // input text in all fields
    await userEvent.clear(screen.getByPlaceholderText("EmployeeNumber"))
    await userEvent.type(screen.getByPlaceholderText("EmployeeNumber"), test_employee_set[0].EmployeeNumber, {delay})
    await userEvent.clear(screen.getByPlaceholderText("Employee Name"))
    await userEvent.type(screen.getByPlaceholderText("Employee Name"), test_employee_set[0].Name, {delay})
    await userEvent.clear(screen.getByPlaceholderText("Employee Email"))
    await userEvent.type(screen.getByPlaceholderText("Employee Email"), test_employee_set[0].Email, {delay})
    await userEvent.click(screen.getByRole("combobox"), {delay});
    const menu = screen.getAllByText(test_roles_set[3].RoleName);
    await userEvent.click(menu[1], {delay})

    // submit form
    const submitButton = screen.getByText("Submit")
    fireEvent.click(submitButton)
  }
}

export const SimulateInvite: Story = {
  ...Template,
  args: {
    variant: "invite"
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement); // todo
    let trigger;
    // open dialog if not open already
    if ((trigger = canvas.getByText("Trigger")) && !screen.queryByText("Submit")) {
      await  userEvent.click(trigger, {delay})
    }
    // input text in all fields
    await userEvent.type(screen.getByPlaceholderText("EmployeeNumber"), test_employee_set[0].EmployeeNumber, {delay})
    await userEvent.type(screen.getByPlaceholderText("Employee Name"), test_employee_set[0].Name, {delay})
    await userEvent.type(screen.getByPlaceholderText("Employee Email"), test_employee_set[0].Email, {delay})
    await userEvent.click(screen.getByRole("combobox"), {delay});
    const menu = screen.getAllByText(test_roles_set[2].RoleName);
    await userEvent.click(menu[1], {delay})

    // submit form
    const submitButton = screen.getByText("Submit")
    fireEvent.click(submitButton)
  }
}

export const SimulateRegistration: Story = {
  ...Template,
  args: {
    variant: "invite"
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement); // todo
    let trigger;
    // open dialog if not open already
    if ((trigger = canvas.getByText("Trigger")) && !screen.queryByText("Submit")) {
      await  userEvent.click(trigger, {delay})
    }
    // input text in all fields
    await userEvent.type(screen.getByPlaceholderText("EmployeeNumber"), test_employee_set[0].EmployeeNumber, {delay})
    await userEvent.type(screen.getByPlaceholderText("Employee Name"), test_employee_set[0].Name, {delay})
    await userEvent.type(screen.getByPlaceholderText("Employee Email"), test_employee_set[0].Email, {delay})
    // input password to password field
    await userEvent.click(screen.getByRole("combobox"), {delay});
    const menu = screen.getAllByText(test_roles_set[2].RoleName);
    await userEvent.click(menu[1], {delay})

    // submit form
    const submitButton = screen.getByText("Submit")
    fireEvent.click(submitButton)
  }
}
