import UserAuthForm from "@/app/authentication/components/user-auth-form";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { userEvent } from "@storybook/testing-library";
import { getCookie, getCookieName, test_admin_info } from "../../../jest-setup";
import SalesTable from "@/components/tables/sales-table";
import { test_employee_set, test_sales_set } from "@/tests/test_data";

describe("Sales Table Component", () => {
  // use this at the start of all tests to login as the integration admin with all permissions
  // if your tests don't require any permissions (no reading/writing to db involved) you can use test_user_info instead.
  test.todo("Test this! No longer needs auth. Just use the ");

  // beforeAll(async () => {
  //   render(<UserAuthForm />);
  //
  //   const emailField = screen.getByRole("textbox");
  //   const passwordField = screen.getByPlaceholderText("password");
  //   const submitButton = screen.getByRole("button", { name: "Sign In" });
  //
  //   await act(async () => {
  //     await userEvent.type(emailField, test_admin_info.email);
  //     await userEvent.type(passwordField, test_admin_info.password);
  //     await userEvent.click(submitButton);
  //   });
  //
  //   // Wait for the success indicator (or any other element that indicates successful login)
  //   await waitFor(() => screen.getByTestId("success"), { timeout: 10000 });
  //
  //   // Assert that the authentication cookie is present
  //   const cookie = getCookie(getCookieName());
  //   expect(cookie).not.toBeNull();
  // });
  //
  // it("test rendering the add sale modal on click", async () => {
  //   render(
  //     <SalesTable
  //       data={test_sales_set}
  //       employees={test_employee_set}
  //       loading={false}
  //     />,
  //   );
  //   const addSaleButton = screen.getByText("Add Sale");
  //   await act(async () => {
  //     await userEvent.click(addSaleButton);
  //   });
  //   await waitFor(() => screen.getByPlaceholderText("Customer Name"), {
  //     timeout: 10000,
  //   });
  //   expect(screen.getByPlaceholderText("Customer Name")).toBeInTheDocument();
  // });
});
