import {RoleSelectModalForm} from "@/app/(pages)/admin/employees/components/RoleSelectModalForm";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {Meta, StoryObj} from "@storybook/react";
import {
  EmployeeSelectModalForm,
  EmployeeSelectModalFormProps
} from "@/app/(pages)/admin/employees/components/EmployeeSelectModalForm";
import {test_employee_set, test_roles_set} from "@/stories/data.test";
import {JSX, ReactElement, useState} from "react";
import "./global.css"

// TODO still unfinished.
export default {
  title: 'Your Component',
  component: EmployeeSelectModalForm,
} as Meta;

export const EmployeeStory: StoryObj<EmployeeSelectModalFormProps> = (args: EmployeeSelectModalFormProps) => (
    <EmployeeSelectModalForm {...args} />
);

EmployeeStory.args = {
  employee: test_employee_set[0],
  roles: test_roles_set,
  variant: null,
};

EmployeeStory.argTypes = {
  employee: {
    options: test_employee_set,
    defaultValue: test_employee_set[0],
    control: { type: 'select' },
  },
  variant: {
    options: [null, 'invite', 'register'],
    control: { type: 'radio' },
  },
};

// export const EmployeeModal: StoryObj<FormModalProps> = (args: JSX.IntrinsicAttributes & FormModalProps) => {
//   const [showDialog, setShowDialog] = useState(args.showDialog);
//
//   const toggleDialog = () => {
//     setShowDialog(!showDialog);
//     console.log(showDialog)
//   }
//   // @ts-ignore
//   return (
//       <FormModal {...args} showDialog={showDialog} setShowDialog={toggleDialog}>
//         <EmployeeStory {...EmployeeStory.args} />
//       </FormModal>
//   )
// };

// EmployeeModal.args = {
//   showDialog: true,
//   title: 'Create Employee',
// };
//
// EmployeeModal.argTypes = {
//   showDialog: {
//     control: {
//       type: 'boolean'
//     }
//   }
// };