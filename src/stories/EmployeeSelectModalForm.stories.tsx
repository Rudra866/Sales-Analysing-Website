import {EmployeeSelectModalForm, EmployeeSelectModalFormProps} from "@/app/(pages)/admin/employees/components/EmployeeSelectModalForm";
import "./global.css"
import {test_employee_set, test_roles_set} from "@/stories/data.test";
import {Meta, StoryObj} from "@storybook/react";
import { JSX } from "react";

// eslint-disable-next-line storybook/story-exports
type Story = StoryObj<typeof EmployeeSelectModalForm>

// export default { component: RoleSelectModalForm };
const meta: Meta<typeof EmployeeSelectModalForm> = {
      component: EmployeeSelectModalForm,
      argTypes: {
            roles: {
                  options: [...test_roles_set],
                  control: {type: "check"}
            },
      },
      excludeStories: ['EmployeeStory']
}
export default meta;

export const EmployeeStory: Story = (args: JSX.IntrinsicAttributes & EmployeeSelectModalFormProps) => {
      return (
            <EmployeeSelectModalForm {...args}/>
      )
}


EmployeeStory.args = {
      employee: test_employee_set[0],
      roles: test_roles_set,
}
