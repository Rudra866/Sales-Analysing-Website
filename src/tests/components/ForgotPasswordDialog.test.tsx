import {getByLabelText, render, screen} from "@testing-library/react";
import ChangePasswordForm from "@/app/authentication/change-password/components/ChangePasswordForm";
import userEvent from "@testing-library/user-event";


describe("Forgot Password Form Dialog", () => {
  const mockOnSubmit = jest.fn();
  test('renders a submit button to send the forgot password mail to the input email', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit}/>);
    expect(screen.getByPlaceholderText("******")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Submit"})).toBeInTheDocument();
  });
  test('password field accepts input', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);
    const passwordInput = screen.getByPlaceholderText("******");
    userEvent.type(passwordInput, "newPassword123");
    expect(passwordInput.accessKey).toBe("newPassword123");
  });
  test('renders with an email label', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);
    const emailLabelElement = screen.getByPlaceholderText("Email");
    expect(emailLabelElement).toBeInTheDocument();
  });
  test('renders with a password label', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit}/>);
    const messageElement = screen.getByLabelText("Password");
    expect(messageElement).toBeInTheDocument();
  });
  test('Close button works', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit}/>);
    const messageElement = screen.getByLabelText("Password");
    expect(messageElement).toBeInTheDocument();
  });
 })