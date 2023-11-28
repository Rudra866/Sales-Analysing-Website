import React from "react";
import { act, render, screen } from "@testing-library/react";
import DashboardPage from "@/admin/dashboard/page";
import { FakeDashboardProvider } from "@/stories/Dashboard/FakeDashboardProvider";

describe("Dashboard Page", () => {
  test.todo(
    "Focus on making component tests for various parts of the dashboard, rather than this page",
  );
  test("renders the date range picker and download button", async () => {
    const date = new Date();

    await act(async () => {
      render(
        <FakeDashboardProvider startDate={date} endDate={date}>
          <DashboardPage />
        </FakeDashboardProvider>,
      );
    });

    const downloadButton = screen.getByRole("button", { name: "Download" });

    expect(downloadButton).toBeInTheDocument();
  });

  test("displays the most sold vehicle card", async () => {
    await act(async () => {
      render(
        <FakeDashboardProvider startDate={new Date()} endDate={new Date()}>
          <DashboardPage />
        </FakeDashboardProvider>,
      );
    });
    const cardHeader = screen.getByRole("heading", {
      name: /most sold vehicle/i,
    });

    expect(cardHeader).toBeInTheDocument();
  });
});
