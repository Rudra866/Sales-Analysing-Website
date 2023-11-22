import results from "../../.jest-test-results.json"
import {Meta, StoryObj} from "@storybook/react";
import UserAuthForm from "@/app/authentication/components/user-auth-form";
import {withTests} from "@storybook/addon-jest";

export default {
  title: 'Auth form',
  component: UserAuthForm,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
  },

  decorators: [withTests({ results })]
} as Meta;

export const Default: StoryObj<typeof UserAuthForm> = {
  args: {

  },
  parameters: {
    jest: ['user-auth-form.test.tsx']
  }
};