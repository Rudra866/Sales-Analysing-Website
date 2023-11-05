import {Meta, StoryObj} from "@storybook/react";
import {Search} from "@/components/dashboard-components/search";
import {Overview} from "@/app/(pages)/dashboard/components/overview";
import {
  DashboardContext,
} from "@/app/(pages)/dashboard/components/dashboard-provider";
import React, {PropsWithChildren, useEffect, useState} from "react";
import {DateRange} from "react-day-picker";

import {Sale} from "@/lib/database";
import {test_roles_set, test_sales_set} from "@/stories/data.test";
import {addDays, subDays, subMonths, subYears} from "date-fns";
import {FakeDashboardProvider} from "@/stories/FakeDashboardProvider";

export default {
  title: 'Dashboard/Overview',
  component: Overview,
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