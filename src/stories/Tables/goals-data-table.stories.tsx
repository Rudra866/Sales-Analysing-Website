import { Meta, StoryObj } from "@storybook/react";
import {
  test_employee_set,
  test_goals_set,
  test_monthly_sales,
} from "@/tests/test_data";
import { SalesGoal } from "@/lib/database";
import SalesGoalTable from "@/components/tables/sales-goal-table";

export default {
  title: "Tables/Goals Table",
  component: SalesGoalTable,
} as Meta;

export const Tasks: StoryObj<typeof SalesGoalTable> = {
  args: {
    loading: false,
    data: test_goals_set as unknown[] as SalesGoal[],
    monthlySales: test_monthly_sales,
    employees: test_employee_set,
  },
};
