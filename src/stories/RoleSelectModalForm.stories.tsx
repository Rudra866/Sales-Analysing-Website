import {RoleSelectModalForm, RoleSelectModalFormProps} from "@/app/(pages)/admin/employees/components/RoleSelectModalForm";
import "./global.css"
import FormModal from "@/components/FormModal";
import {test_employee_set, test_roles_set} from "@/stories/data.test";
import {Meta, StoryObj} from "@storybook/react";
import {JSX} from "react";

type Story = StoryObj<typeof BuiltComponent>


const BuiltComponent = (props: JSX.IntrinsicAttributes & RoleSelectModalFormProps) => {
      return (
          <FormModal setShowDialog={doNothing} title={"Form Modal"} showDialog={true}>
                <RoleSelectModalForm {...props}/>
          </FormModal>
      )
}

// export default { component: RoleSelectModalForm };
const meta: Meta<typeof BuiltComponent> = {
      component: BuiltComponent,
      argTypes: {
            // employee: {
            //       options: test_employee_set,
            //       control: {type: 'select'}
            // },
            roles: {
                  options: test_roles_set,
                  control: {type: "check"}
            }
      }
}
export default meta;

const doNothing = (something?:any) => {return};

export const Default: Story = (args: JSX.IntrinsicAttributes & RoleSelectModalFormProps) => {
      return <BuiltComponent {...args} />;
};

Default.args = {
      employee: test_employee_set[0],
      roles: test_roles_set,
}