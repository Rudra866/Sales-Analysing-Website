import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {UserAuthForm} from "@/app/authentication/components/user-auth-form";
import {userEvent} from "@storybook/testing-library";
import {act} from "react-dom/test-utils";
import {test_user_info} from "../../../jest-setup";


function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    if (cookieValue) {
      return cookieValue;
    }
  }
  return null;
}

// implement -- strip url, add "-auth-token"
function getCookieName() {
  return "sb-ciguaogfmmnxjxfqpwhp-auth-token"
}

describe("User Authentication form", () => {
  test('renders with a email label', () => {
    render(<UserAuthForm/>);
    const messageElement = screen.getByLabelText("Email");
    expect(messageElement).toBeInTheDocument();
  });

  test('renders with a password label', () => {
    render(<UserAuthForm/>);
    const messageElement = screen.getByLabelText("Password");
    expect(messageElement).toBeInTheDocument();
  });

  test('renders with an email field', () => {
    render(<UserAuthForm/>);
    const emailField = screen.getByPlaceholderText('name@example.com');
    expect(emailField).toBeInTheDocument();
    expect(emailField.id).toEqual('email');
    expect(emailField.getAttribute('type')).toBe('email')
  });

  test('renders with a password field', () => {
    render(<UserAuthForm/>);
    const passwordField = screen.getByPlaceholderText("password");
    expect(passwordField).toBeInTheDocument();
    expect(passwordField.id).toEqual('password');
    expect(passwordField.getAttribute('type')).toBe('password')
  });

// add more tests for component functionality
  test('renders a submit button to send the form', () => {
    render(<UserAuthForm/>);
    const submitButton = screen.getByRole("button", {name: 'Sign In'});
    expect(submitButton).toBeInTheDocument();
  });


  it('allows a user to login and receive confirmation', async() => {
    act(() => {
      render(<UserAuthForm/>)
    })

    const emailField = screen.getByRole("textbox");
    const passwordField = screen.getByPlaceholderText("password");
    const submitButton = screen.getByRole("button", {name: 'Sign In'});

    await act(async () => {
      await userEvent.type(emailField, test_user_info.email);
      await userEvent.type(passwordField, test_user_info.password);
      await userEvent.click(submitButton)
    })

    await waitFor(() => screen.getByText('success!'), {timeout: 10000}) // todo change on login UI
    const cookie = getCookie(getCookieName());
    expect(cookie).not.toBeNull()
  })
})

