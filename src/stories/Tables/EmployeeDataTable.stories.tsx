import DataTable, {DataTableProps} from "@/components/tables/DataTable"
import EmployeeTable from "@/components/tables/EmployeeTable"
import {Meta, StoryObj} from "@storybook/react";
import React from "react";

import {Employee} from "@/lib/database";

export default {
  title: 'Tables/Employee Table',
  component: DataTable,
  render: () => <EmployeeTable/>,
  args: {
    loading: true
  },

} as Meta;


// todo modify when we remove data collection from the tables
// modify some props in too or change the nesting of these
export const Employees: StoryObj<DataTableProps<Employee>> = {
  args: {

  }
}
