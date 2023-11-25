import { Meta, StoryObj } from "@storybook/react";
import { test_employee_set, test_tasks_set } from "@/tests/test_data";
import TaskTable from "@/components/tables/task-table";
import { Task } from "@/lib/database";

export default {
  title: "Tables/Task Table",
  component: TaskTable,
} as Meta;

export const Tasks: StoryObj<typeof TaskTable> = {
  args: {
    loading: false,
    data: test_tasks_set as unknown[] as Task[],
    employees: test_employee_set,
  },
};
