import {UserNav} from "@/components/dashboard-components/user-nav";
import {Meta, StoryObj} from "@storybook/react";

export default {
  title: 'Dashboard/User Navigation',
  component: UserNav,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta;

export const Default: StoryObj<typeof UserNav> = {
  args: {}
};

