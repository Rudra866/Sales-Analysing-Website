import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormModal from "@/components/dialogs/form-modal";
import { EmployeeSelectDialog } from "@/components/dialogs/employee-select-dialog";
import { test_roles_set } from "@/tests/test_data";

describe("Base Form Dialog Component", () => {
  test("renders with passed in title prop", () => {
    render(
      <FormModal
        title={"Form Modal"}
        showDialog={true}
        setShowDialog={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    const title = screen.getByRole("heading");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toEqual("Form Modal");
  });

  test("renders with passed in empty body prop", () => {
    render(
      <FormModal
        title={"Form Modal"}
        showDialog={true}
        setShowDialog={jest.fn()}
        onSubmit={jest.fn()}
      >
        <div data-testid="empty-div" />
      </FormModal>,
    );
    const body = screen.getByTestId("empty-div");
    expect(body).toBeInTheDocument();
  });
  test("renders with the employee edit form", () => {
    render(
      <FormModal
        title={"Form Modal"}
        showDialog={true}
        setShowDialog={jest.fn()}
        onSubmit={jest.fn()}
      >
        <EmployeeSelectDialog roles={test_roles_set} />
      </FormModal>,
    );
    expect(screen.getByText(/employeenumber/i)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /employeenumber/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();

    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();

    expect(screen.getByText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /role/i })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
