import {
  RoleSelectModalForm,
  RoleSelectModalFormProps
} from "@/app/(pages)/admin/employees/components/RoleSelectModalForm";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {test_employee_set, test_roles_set} from "@/stories/test_data";
import {Meta, StoryObj} from "@storybook/react";
import {Dispatch, SetStateAction} from "react";
import {useArgs} from "@storybook/preview-api";
import {Button} from "@/components/ui/button";

type RoleSelectModalCustomArgs = RoleSelectModalFormProps & FormModalProps;
type Story = StoryObj<RoleSelectModalCustomArgs>
const meta: Meta<RoleSelectModalCustomArgs> = {
  title: "Dialogs/Role Form",
  component: RoleSelectModalForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    employee: {
      options: ["Employee1", "Employee2", "Employee3"],
      mapping: {
        Employee1: test_employee_set[0],
        Employee2: test_employee_set[1],
        Employee3: test_employee_set[2],
      }
    },
    roles: { // todo defaults for changing
      options: ["One Role", "Three Roles", "All Roles"],
      mapping: {
        "One Role": [test_roles_set[0]],
        "Three Roles": test_roles_set.slice(0, 3),
        "All Roles": test_roles_set
      }
    },
    showDialog: {
      type: "boolean",
    }
  },
  render: function Render(args) {
    const [{showDialog}, updateArgs] = useArgs();
    const setShowDialog = (value: boolean) => {
      updateArgs({showDialog: value})
    }
    return (
        <>
          <Button onClick={() => setShowDialog(true)}>Trigger</Button>
          <FormModal title={"Form Modal"} onSubmit={() => {
            return
          }}
                     setShowDialog={setShowDialog as Dispatch<SetStateAction<boolean>>}
                     showDialog={showDialog}>
            <RoleSelectModalForm {...args}/>
          </FormModal>
        </>
    )
  }
}
export default meta;

export const Default: Story = {
  args: {
    roles: test_roles_set,
    employee: test_employee_set[0],
    showDialog: true,
  }
}