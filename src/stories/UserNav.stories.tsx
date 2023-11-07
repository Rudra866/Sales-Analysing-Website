// import {UserNav} from "@/components/dashboard-components/user-nav";
import {Meta, StoryObj} from "@storybook/react";
import {getAllByRole, userEvent, within, screen} from "@storybook/testing-library";
import {UserNav} from "@/components/user-nav";

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
  args: {},
  play: async function(context) {
    const canvas = within(context.canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button, {delay: 100})
    // todo test menu items

  }
};

