import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import {subMonths} from "date-fns";
import {FakeDashboardProvider} from "@/stories/Dashboard/FakeDashboardProvider";
import {Overview} from "@/admin/dashboard/components/overview";

export default {
  title: 'Dashboard/Tables',
  component: Overview,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <FakeDashboardProvider startDate={context.args.startDate} endDate={context.args.endDate}>
        <Story/>
      </FakeDashboardProvider>
    ),
  ],
} as Meta;

export const Month: StoryObj<typeof Overview> = {
  args: {
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
  },
};

export const ThreeMonths: StoryObj<typeof Overview> = {
  args: {
    startDate: subMonths(new Date(), 3),
    endDate: new Date(),
  },
};

export const SixMonths: StoryObj<typeof Overview> = {
  args: {
    startDate: subMonths(new Date(), 6),
    endDate: new Date(),
  },
};

export const NineMonths: StoryObj<typeof Overview> = {
  args: {
    startDate: subMonths(new Date(), 9),
    endDate: new Date(),
  },
};

export const Year: StoryObj<typeof Overview> = {
  args: {
    startDate: subMonths(new Date(), 12),
    endDate: new Date(),
  },
};