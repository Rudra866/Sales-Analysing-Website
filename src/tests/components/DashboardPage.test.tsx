import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from "@/app/(pages)/dashboard/page";
import {FakeDashboardProvider} from "@/stories/Dashboard/FakeDashboardProvider";
import {DashboardProvider} from "@/app/(pages)/dashboard/components/dashboard-provider";

describe("Dashboard Page", () => {
  test('renders the dashboard page title', () => {
    render(
      <FakeDashboardProvider startDate={new Date()} endDate={new Date()}>
            <DashboardPage />
      </FakeDashboardProvider>
    );

    const pageTitle = screen.getByText('Dashboard');
    expect(pageTitle).toBeInTheDocument();
  });

  test('renders the date range picker and download button', () => {
    const date = new Date()

    render(
        <FakeDashboardProvider startDate={date} endDate={date}>
          <DashboardPage />
        </FakeDashboardProvider>
    );
    // const dateRangePicker = screen.getByRole('button') // TODO
    const downloadButton = screen.getByRole('button', { name: 'Download' });

    // expect(dateRangePicker).toBeInTheDocument();
    expect(downloadButton).toBeInTheDocument();
  });

  test('renders the tabs with Overview tab selected by default', () => {
    render(
        <FakeDashboardProvider startDate={new Date()} endDate={new Date()}>
          <DashboardPage />
        </FakeDashboardProvider>
    );
    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const salesTableTab = screen.getByRole('tab', { name: 'Sales Table' });
    const reportsTab = screen.getByRole('tab', { name: 'Reports' });
    const notificationsTab = screen.getByRole('tab', { name: 'Notifications' });

    expect(overviewTab).toBeInTheDocument();
    expect(salesTableTab).toBeInTheDocument();
    expect(reportsTab).toBeInTheDocument();
    expect(notificationsTab).toBeInTheDocument();

    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(salesTableTab).toHaveAttribute('aria-selected', 'false');
    expect(reportsTab).toHaveAttribute('aria-selected', 'false');
    expect(notificationsTab).toHaveAttribute('aria-selected', 'false');
  });

  test('displays the first monthly revenue card', () => {
    render(
        <FakeDashboardProvider startDate={new Date()} endDate={new Date()}>
          <DashboardPage />
        </FakeDashboardProvider>
    );
    const totalRevenueCard = screen.getByText('Total Revenue for the month');
    const totalRevenueValue = screen.getAllByText('$0');

    expect(totalRevenueCard).toBeInTheDocument();
    expect(totalRevenueValue[0]).toBeInTheDocument();
  });

  // test('displays the second monthly revenue card', () => {
  //   render(
  //       <FakeDashboardProvider startDate={new Date()} endDate={new Date()}>
  //         <DashboardPage />
  //       </FakeDashboardProvider>
  //   );
  //   const totalRevenueCard = screen.getByText('Total Revenue for the year');
  //   const totalRevenueValue = screen.getAllByText('$0');
  //
  //   expect(totalRevenueCard).toBeInTheDocument();
  //   expect(totalRevenueValue[1]).toBeInTheDocument();
  // });
})
