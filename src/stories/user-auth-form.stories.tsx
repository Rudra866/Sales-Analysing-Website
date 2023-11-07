import {Meta, StoryObj} from "@storybook/react";
import {UserAuthForm} from "@/app/authentication/components/user-auth-form";

export default {
  title: 'Auth form',
  component: UserAuthForm,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
  }
} as Meta;

export const Default: StoryObj<typeof UserAuthForm> = {
  args: {

  }
};