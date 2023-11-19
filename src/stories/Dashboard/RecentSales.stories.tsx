// import {RecentSales} from "@/components/dashboard-components/RecentSales";
import {Meta, StoryObj} from "@storybook/react";
import {FakeDashboardProvider} from "@/stories/Dashboard/FakeDashboardProvider";
import {RecentSales} from "@/admin/dashboard/components/recent-sales";
// todo

// replace this with actual sales in recent order.
export default {
  title: 'Dashboard/Recent Sales',
  component: RecentSales,

  decorators: [(Story) => (
      <FakeDashboardProvider startDate={new Date()} endDate={new Date()}>
        <Story/>
      </FakeDashboardProvider>
  )
  ],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  }
} as Meta;

export const Default: StoryObj<typeof RecentSales> = {
  args: {
  }
};
