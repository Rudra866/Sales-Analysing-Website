import EmployeeTable from "@/components/tables/employee-table";
import { Meta, StoryObj } from "@storybook/react";

import { test_employee_set, test_roles_set } from "@/tests/test_data";
export default {
  title: "Tables/Employee Table",
  component: EmployeeTable,
} as Meta;

export const Employees: StoryObj<typeof EmployeeTable> = {
  args: {
    loading: false,
    data: test_employee_set,
    roles: test_roles_set,
  },
};
