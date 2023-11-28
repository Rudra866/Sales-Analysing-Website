import { Meta, StoryObj } from "@storybook/react";
import SalesTable from "@/components/tables/sales-table";
import { test_employee_set, test_sales_set } from "@/tests/test_data";

export default {
  title: "Tables/Sales Table",
  component: SalesTable,
} as Meta;

export const Sales: StoryObj<typeof SalesTable> = {
  args: {
    loading: false,
    data: test_sales_set,
    employees: test_employee_set,
  },
};
