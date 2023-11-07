import { Button } from '@/components/ui/button';
import {Meta, StoryObj} from "@storybook/react";
import {MainNav} from "@/components/main-nav";
import {MainNavItem} from "@/lib/types";

const meta = {
  title: 'chadcn/Main Nav',
  component: MainNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;
export default meta;


export const Default: StoryObj<MainNavItem> = {
  render: () => <MainNav/>
}