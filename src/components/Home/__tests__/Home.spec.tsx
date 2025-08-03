import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ---- Mocks: Define INSIDE the factory and assign to globalThis ----
vi.mock('@tanstack/react-router', () => {
  globalThis.invalidateMock = vi.fn();
  globalThis.useLoaderDataMock = vi.fn(() => ({ count: 42 }));

  return {
    useRouter: () => ({
      invalidate: globalThis.invalidateMock,
    }),
    useLoaderData: globalThis.useLoaderDataMock,
  };
});

vi.mock('../actions', () => {
  globalThis.updateCountMock = vi.fn(() => Promise.resolve());
  return {
    updateCount: globalThis.updateCountMock,
  };
});

// ---- Import Component ----
import { Home } from '../index';

// ---- Tests ----
describe('<Home />', () => {
  beforeEach(() => {
    globalThis.invalidateMock.mockClear();
    globalThis.useLoaderDataMock.mockClear();
    globalThis.updateCountMock.mockClear();
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
      expect(globalThis.updateCountMock).toHaveBeenCalledWith({ data: 1 });
      expect(globalThis.invalidateMock).toHaveBeenCalled();
    });
  });
});
