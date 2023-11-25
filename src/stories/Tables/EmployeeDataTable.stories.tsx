import DataTable, { DataTableProps } from "@/components/tables/data-table";
import EmployeeTable from "@/components/tables/employee-table";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Employee } from "@/lib/database";
import { test_employee_set, test_roles_set } from "@/tests/test_data";
export default {
  title: "Tables/Employee Table",
  component: DataTable,
  render: () => (
    <EmployeeTable
      loading={true}
      data={test_employee_set}
      roles={test_roles_set}
    />
  ),
  args: {
    loading: true,
  },
} as Meta;

// todo modify when we remove data collection from the tables
// modify some props in too or change the nesting of these
export const Employees: StoryObj<DataTableProps<Employee>> = {};
