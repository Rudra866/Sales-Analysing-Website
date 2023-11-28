import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import UserAuthForm from "@/app/authentication/components/user-auth-form";
import {userEvent} from "@storybook/testing-library";
import {act} from "react-dom/test-utils";
import {getCookie, getCookieName, test_user_info} from "../../../jest-setup";
import UserForm from "@/admin/settings/components/user-form";


describe("User Settings Form", () => {
    test('renders with a name label', () => {
        render(<UserForm />);
        const messageElement = screen.getByLabelText("Employee Name");
        expect(messageElement).toBeInTheDocument();
    });


    test('renders with a email label', () => {
        render(<UserForm />);
        const messageElement = screen.getByLabelText("Account Email");
        expect(messageElement).toBeInTheDocument();
    }
    );

    test('renders with a number label', () => {
        render(<UserForm />);
        const messageElement = screen.getByLabelText("Employee Number");
        expect(messageElement).toBeInTheDocument();
    });

    test('renders with a role label', () => {
        render(<UserForm />);
        const messageElement = screen.getByLabelText("Role");
        expect(messageElement).toBeInTheDocument();
    });

    // it('allows a user to login and receive confirmation', async() => {
    //     act(() => {
    //         render(<UserForm/>)
    //     })
    //
    //     const nameField = screen.getByLabelText("Employee Name");
    //     const numberField = screen.getByLabelText("Employee Number");
    //     const emailField = screen.getByLabelText("Account Email");
    //     const roleField = screen.getByLabelText("Role");
    //
    //     await act(async () => {
    //         await userEvent.type(nameField, test_user_info.name);
    //         await userEvent.type(numberField, test_user_info.number);
    //         await userEvent.type(emailField, test_user_info.email);
    //         await userEvent.type(roleField, test_user_info.role);
    //     })
    //
    //     await waitFor(() => {
    //         expect(nameField).toHaveValue(test_user_info.name);
    //         expect(numberField).toHaveValue(test_user_info.number);
    //         expect(emailField).toHaveValue(test_user_info.email);
    //         expect(roleField).toHaveValue(test_user_info.role);
    //     }, {timeout: 10000})
    // });
});






