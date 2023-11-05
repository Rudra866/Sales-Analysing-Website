import {RoleSelectModalForm} from "@/app/(pages)/admin/employees/components/RoleSelectModalForm";
import FormModal, {FormModalProps} from "@/components/FormModal";
import {Meta, StoryObj} from "@storybook/react";
import {test_employee_set, test_roles_set} from "@/stories/data.test";
import {useState} from "react";

// TODO still unfinished.
export default {
  title: 'Form Dialog',
  component: FormModal,
} as Meta;


export const Default: StoryObj<typeof FormModal> = {
  render: (args) => <FormModal {...args} />,
  args: {
    showDialog: true,
  },
}

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