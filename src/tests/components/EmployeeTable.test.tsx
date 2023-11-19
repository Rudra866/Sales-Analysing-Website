import EmployeeTable from "@/components/tables/EmployeeTable";
import {render, screen} from "@testing-library/react";

describe("Employee Table Component", () => {
  it('renders the table header', () => {
    render(<EmployeeTable />);

    const header = screen.getByRole("button", {name: "Name"});
    expect(header).toBeInTheDocument();
  });

  it('renders the filter textbox', () => {
    render(<EmployeeTable />);

    const textbox = screen.getByPlaceholderText("Filter employees...");
    expect(textbox).toBeInTheDocument();
    expect(textbox).toBeVisible()
  });

})
