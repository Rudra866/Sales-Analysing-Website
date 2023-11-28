import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { userEvent } from "@storybook/testing-library";
import SalesTable from "@/components/tables/sales-table";
import { test_employee_set, test_sales_set } from "@/tests/test_data";

describe("Sales Table Component", () => {
  // use this at the start of all tests to login as the integration admin with all permissions
  // if your tests don't require any permissions (no reading/writing to db involved) you can use test_user_info instead.
  test.todo("Test this! No longer needs auth. Just use the provided data!");
  test.todo("Test that table actually displays some data");
  test.todo("Test that the table has a row options button");
  test.todo(
    "Test that the row action buttons actually work (can't test deletes)",
  );
  test.todo("Test if there's a filter button? if the filtering even works?");

  test("test rendering the add sale modal on click", async () => {
    render(
      <SalesTable
        data={test_sales_set}
        employees={test_employee_set}
        loading={false}
      />,
    );
    const addSaleButton = screen.getByText("Add Sale");
    await act(async () => {
      await userEvent.click(addSaleButton);
    });
    await waitFor(() => screen.getByPlaceholderText("Customer Name"), {});
    expect(screen.getByPlaceholderText("Customer Name")).toBeInTheDocument();
  });
});
