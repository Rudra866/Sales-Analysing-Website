import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthenticationPage from "@/app/authentication/page";
import React from "react";

describe("Authentication Page", () => {
  test("renders decorative sidebar image", async () => {
    await act(async () => {
      render(<AuthenticationPage />);
    });
    const leftPaneImage = screen.getAllByRole("img")[1];
    expect(leftPaneImage).toBeInTheDocument();
    expect(leftPaneImage).toHaveAttribute("alt");
    expect(leftPaneImage.getAttribute("alt")).toEqual(
      "decorative sidebar image",
    );
  });

  test("renders corner logo", async () => {
    await act(async () => {
      render(<AuthenticationPage />);
    });
    const leftPaneImage = screen.getAllByRole("img")[0];
    expect(leftPaneImage).toBeInTheDocument();
    expect(leftPaneImage).toHaveAttribute("alt");
    expect(leftPaneImage.getAttribute("alt")).toEqual("icon");
  });

  test("renders with an email field", async () => {
    await act(async () => {
      render(<AuthenticationPage />);
    });
    const emailField = screen.getByRole("textbox");
    expect(emailField).toBeInTheDocument();
    expect(emailField).toHaveAttribute("id", "email");
  });

  test("renders with a password field", async () => {
    await act(async () => {
      render(<AuthenticationPage />);
    });

    const passwordField = screen.getByPlaceholderText("password");
    expect(passwordField).toBeInTheDocument();
    expect(passwordField.id).toEqual("password");
    expect(passwordField.getAttribute("type")).toBe("password");
  });

  test("renders a submit button to send the form", async () => {
    await act(async () => {
      render(<AuthenticationPage />);
    });
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeInTheDocument();
  });
});
