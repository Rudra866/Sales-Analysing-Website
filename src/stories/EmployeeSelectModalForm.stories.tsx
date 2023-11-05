import {EmployeeSelectModalForm, EmployeeSelectModalFormProps} from "@/app/(pages)/admin/employees/components/EmployeeSelectModalForm";
import "./global.css"
import {test_employee_set, test_roles_set} from "@/stories/data.test";
import {Meta, StoryObj} from "@storybook/react";
import FormModal, {FormModalProps} from "@/components/FormModal";

// eslint-disable-next-line storybook/story-exports


type EmployeeSelectModalCustomArgs = EmployeeSelectModalFormProps & FormModalProps
type Story = StoryObj<EmployeeSelectModalCustomArgs>
// export default { component: RoleSelectModalForm };
const meta: Meta<EmployeeSelectModalCustomArgs> = {
      title: "Test",
      component: EmployeeSelectModalForm,
      decorators: [

      ],
      argTypes: {
            roles: {
                  options: [...test_roles_set],
                  control: {type: "check"}
            },
      },
}
export default meta;

export const EmployeeStory: Story = {
      render: args => (
          <FormModal {...args}>
                <EmployeeSelectModalForm {...args}/>
          </FormModal>
      ),
      args: {
            employee: test_employee_set[0],
            roles: test_roles_set,
            showDialog: true,
            onEmployeeUpdate: employee => (console.log(employee))
      }
}
