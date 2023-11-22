import {MainNav} from "@/components/main-nav";
import '@testing-library/jest-dom';
import {render, screen} from "@testing-library/react";
import {docsConfig} from "@/lib/config";

// not much point testing this
describe('MainNav Component', () => {
  test('renders MainNav component', () => {
    render(<MainNav />);
    const navElement = screen.getByRole('navigation');
  });

  test('displays navigation links', () => {
    render(<MainNav />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(docsConfig.mainNav.length);
  });
});
