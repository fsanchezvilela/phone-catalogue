import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ---- Mocks ----

// Mock the router and capture the invalidate function for assertions
const invalidateMock = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    invalidate: invalidateMock,
  }),
}));

// Mock the loader data (set to 42 as an example)
vi.mock('~/routes/home', () => ({
  RouteHome: {
    useLoaderData: () => 42,
  },
}));

// Mock the updateCount action
const updateCountMock = vi.fn(() => Promise.resolve());
vi.mock('~/routes/home/actions', () => ({
  updateCount: updateCountMock,
}));

// ---- Import Component ----
import { Home } from '~/components/Home';

// ---- Tests ----
describe('<Home />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with loader data and handles click', async () => {
    render(<Home />);

    // Check button label shows loader data
    const button = screen.getByRole('button', { name: /Add 1 to 42/i });
    expect(button).toBeInTheDocument();

    // Click the button
    fireEvent.click(button);

    // Wait for async updateCount call to resolve and invalidate to be called
    await waitFor(() => {
      expect(updateCountMock).toHaveBeenCalledWith({ data: 1 });
      expect(invalidateMock).toHaveBeenCalled();
    });
  });
});
