import {Meta, StoryObj} from "@storybook/react";
import {Search} from "@/components/dashboard-components/search";


export default {
  title: 'Dashboard/Search',
  component: Search,
  parameters: {
    layout: "centered",
  }
} as Meta;

export const Default: StoryObj<typeof Search> = {
  args: {

  }
};