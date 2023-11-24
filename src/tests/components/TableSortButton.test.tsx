import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableSortButton from "@/components/tables/table-sort-button";
import { Column } from "@tanstack/react-table";
import React from "react";

describe("TableSortButton", () => {
    const mockGetIsSorted = jest.fn();
    const mockToggleSorting = jest.fn();
    const mockColumn = {
        id: "Test Column",
        getIsSorted: mockGetIsSorted,
        toggleSorting: mockToggleSorting,
    } as Partial<Column<any>> as Column<any>;

    test('renders the button with the correct text', () => {
        render(<TableSortButton column={mockColumn} />);
        expect(screen.getByRole("button", { name: /Test Column/i })).toBeInTheDocument();
    });

    test('clicking the button toggles sorting', () => {
        mockGetIsSorted.mockReturnValueOnce("asc");
        render(<TableSortButton column={mockColumn} />);
        userEvent.click(screen.getByRole("button"));
        expect(mockToggleSorting).toHaveBeenCalledWith("desc");
    });
});
