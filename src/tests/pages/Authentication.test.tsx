import {render, screen, act, getByText, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthenticationPage from "@/app/authentication/page";
import {userEvent} from "@storybook/testing-library";
import UserAuthForm from "@/app/authentication/components/user-auth-form";
import React from "react";



describe('Authentication Page', () => {
  test.todo("Ensure user auth form renders");
  test.todo("Ensure decorative image renders");
  // test('renders decorative sidebar image', () => {
  //   render(<AuthenticationPage/>)
  //   const leftPaneImage = screen.getAllByRole("img")[1]
  //   expect(leftPaneImage).toBeInTheDocument()
  //   expect(leftPaneImage).toHaveAttribute('alt')
  //   expect(leftPaneImage.getAttribute('alt')).toEqual('decorative sidebar image')
  // })
  //
  // test('renders corner logo', () => {
  //   render(<AuthenticationPage/>)
  //   const leftPaneImage = screen.getAllByRole("img")[0]
  //   expect(leftPaneImage).toBeInTheDocument()
  //   expect(leftPaneImage).toHaveAttribute('alt')
  //   expect(leftPaneImage.getAttribute('alt')).toEqual('icon')
  // })
  //
  // test('renders with an email field', () => {
  //   render(<AuthenticationPage/>)
  //   const emailField = screen.getByRole("textbox")
  //   expect(emailField).toBeInTheDocument()
  //   expect(emailField).toHaveAttribute("id", "email")
  // })
  //
  // test('renders with a password field', () => {
  //   render(<AuthenticationPage/>);
  //   const passwordField = screen.getByPlaceholderText("password");
  //   expect(passwordField).toBeInTheDocument();
  //   expect(passwordField.id).toEqual('password');
  //   expect(passwordField.getAttribute('type')).toBe('password')
  // });
  //
  // test('renders a submit button to send the form', () => {
  //   render(<AuthenticationPage/>);
  //   const submitButton = screen.getByRole("button", {name: 'Sign In'});
  //   expect(submitButton).toBeInTheDocument();
  // });
})
