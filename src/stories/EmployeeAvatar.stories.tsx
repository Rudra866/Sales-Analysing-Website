import {Overview} from "@/app/(pages)/dashboard/components/overview";
import {Meta, StoryObj} from "@storybook/react";
import {test_employee_set} from "@/stories/test_data";
import EmployeeAvatar from "@/components/dashboard-components/EmployeeAvatar";

export default {
  title: 'Employee Avatar',
  component: EmployeeAvatar,
  parameters: {
    layout: "centered",
  }
} as Meta;

export const Default: StoryObj<typeof Overview> = {
  args: {
    employee: test_employee_set[0]
  },
};

export const Fallback: StoryObj<typeof Overview> = {
  args: {
    employee: null
  },
};