import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

describe('Home Page', () => {
  it('renders hero heading', async () => {
    render(await Home());

    const heading = screen.getByRole('heading', {
      name: /find verified contractors for every stage of your property project/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders description text', async () => {
    render(await Home());

    const description = screen.getByText(
      /compare services, discover smart home products, and submit your requirements in minutes/i
    );

    expect(description).toBeInTheDocument();
  });
});
