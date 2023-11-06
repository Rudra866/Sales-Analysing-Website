import TeamSwitcher from "@/components/dashboard-components/team-switcher";
import {Overview} from "@/app/(pages)/dashboard/components/overview";
import {Meta, StoryObj} from "@storybook/react";


export default {
  title: 'Dashboard/Team Switcher',
  component: TeamSwitcher,
  parameters: {
    layout: "centered"
  }
} as Meta;

export const Default: StoryObj<typeof Overview> = {
  args: {}
};
