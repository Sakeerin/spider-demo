import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /welcome to spider marketplace/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Home />);

    const description = screen.getByText(
      /connect with verified contractors for your projects/i
    );

    expect(description).toBeInTheDocument();
  });
});
