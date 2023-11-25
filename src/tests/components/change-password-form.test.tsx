import { render, screen } from "@testing-library/react";
import ChangePasswordForm from "@/app/authentication/change-password/components/ChangePasswordForm";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

describe("Password Reset Form", () => {
  const mockOnSubmit = jest.fn();
  test("renders a submit button to send the forgot password mail to the input email", () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText("******")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });
  test("password field accepts input", async () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);
    const passwordInput = screen.getByPlaceholderText("******");
    await act(async () => {
      await userEvent.type(passwordInput, "newPassword123");
    });
    expect(passwordInput).toHaveValue("newPassword123");
  });
  test("password form submits data to callback", async () => {
    render(<ChangePasswordForm onSubmit={(data: any) => mockOnSubmit(data)} />);
    const passwordInput = screen.getByPlaceholderText("******");
    await userEvent.type(passwordInput, "newPassword123");
    await userEvent.click(screen.getByText("Submit"));
    expect(mockOnSubmit).toHaveBeenCalledWith({ password: "newPassword123" });
  });
  test("renders with a password label", () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);
    const messageElement = screen.getByLabelText("Password");
    expect(messageElement).toBeInTheDocument();
  });
  test("Close button works", () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);
    const messageElement = screen.getByLabelText("Password");
    expect(messageElement).toBeInTheDocument();
  });
});
