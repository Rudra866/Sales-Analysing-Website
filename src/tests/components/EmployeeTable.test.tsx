import EmployeeTable from "@/components/tables/employee-table";
import { render, screen } from "@testing-library/react";
import { test_employee_set, test_roles_set } from "@/tests/test_data";

describe("Employee Table Component", () => {
  it("renders the table header", () => {
    render(
      <EmployeeTable
        data={test_employee_set}
        roles={test_roles_set}
        loading={false}
      />,
    );

    const header = screen.getByRole("button", { name: "Name" });
    expect(header).toBeInTheDocument();
  });

  it("renders the filter textbox", () => {
    render(
      <EmployeeTable
        data={test_employee_set}
        roles={test_roles_set}
        loading={false}
      />,
    );

    const textbox = screen.getByPlaceholderText("Filter employees...");
    expect(textbox).toBeInTheDocument();
    expect(textbox).toBeVisible();
  });
});
