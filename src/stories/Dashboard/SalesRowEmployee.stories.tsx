import {SalesRowEmployee} from "@/components/dashboard-components/RecentSales";

import {Meta, StoryObj} from "@storybook/react";
import {test_employee_set} from "@/stories/data.test";


export default {
  title: 'Dashboard/Recent Sales Row',
  component: SalesRowEmployee,
  parameters: {
    layout: "centered",
  }
} as Meta;

export const Default: StoryObj<typeof SalesRowEmployee> = {
  args: {
    employee: test_employee_set[0],
    amount: 445.34,
    saleTime: new Date()
  }
};