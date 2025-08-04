import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PhoneCatalogue } from '..';

// Mock DataTable and Columns
vi.mock('~/components/ui/data-table', () => ({
  DataTable: ({ data }: { columns: unknown; data: Array<{ id: number; name: string }> }) => (
    <div data-testid="DataTable">
      {Array.isArray(data) ? data.map((item) => <div key={item.id}>{item.name}</div>) : 'No data'}
    </div>
  ),
}));
vi.mock('./columns', () => ({
  columns: ['col'],
}));

// --- Mock useSuspenseQuery INSIDE vi.mock, and access via import below ---
vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useSuspenseQuery: vi.fn(),
  };
});
import * as ReactQuery from '@tanstack/react-query';

describe('PhoneCatalogue', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading indicator when loading', () => {
    (ReactQuery.useSuspenseQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: undefined,
    });
    render(<PhoneCatalogue />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message on error', () => {
    (ReactQuery.useSuspenseQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: { message: 'API down!' },
    });
    render(<PhoneCatalogue />);
    expect(screen.getByText(/error: API down!/i)).toBeInTheDocument();
  });

  it('renders DataTable with phone data', () => {
    const data = [
      { id: 1, name: 'iPhone X' },
      { id: 2, name: 'Pixel 7' },
    ];
    (ReactQuery.useSuspenseQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: false,
      data,
      error: null,
    });
    render(<PhoneCatalogue />);
    expect(screen.getByText(/Phone Catalogue List/)).toBeInTheDocument();
    expect(screen.getByTestId('DataTable')).toBeInTheDocument();
    expect(screen.getByText('iPhone X')).toBeInTheDocument();
    expect(screen.getByText('Pixel 7')).toBeInTheDocument();
  });
});
