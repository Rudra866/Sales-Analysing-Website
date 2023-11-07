import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormModal from "@/components/FormModal";

describe('Base Form Dialog Component', () => {
  test('renders with passed in title prop', () => {
    render(<FormModal title={"Form Modal"} showDialog={true} setShowDialog={jest.fn()} onSubmit={jest.fn()} />)
    const title = screen.getByRole("heading");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toEqual("Form Modal")
  })

  test('renders with passed in empty body prop', () => {
    render(
        <FormModal title={"Form Modal"} showDialog={true} setShowDialog={jest.fn()} onSubmit={jest.fn()}>
          <div data-testid="empty-div"/>
        </FormModal>
    )
    const body = screen.getByTestId("empty-div");
    expect(body).toBeInTheDocument();
  })
})
