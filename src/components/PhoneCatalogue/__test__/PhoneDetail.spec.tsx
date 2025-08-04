import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

import { PhoneDetail } from '../PhoneDetail';

// --- Mock Card components to shallow render children only ---
vi.mock('~/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardAction: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  CardContent: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
}));

// --- Mock react-query and router
vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useSuspenseQuery: vi.fn(),
  };
});
vi.mock('@tanstack/react-router', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router');
  return {
    ...actual,
    useParams: vi.fn(),
    Link: ({
      to,
      className,
      children,
    }: {
      to: string;
      className?: string;
      children: React.ReactNode;
    }) => (
      <a href={to} className={className} data-testid="catalogue-link">
        {children}
      </a>
    ),
  };
});

import * as ReactQuery from '@tanstack/react-query';
import * as TanstackRouter from '@tanstack/react-router';

describe('PhoneDetail', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading indicator', () => {
    (TanstackRouter.useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: '99' });
    (ReactQuery.useSuspenseQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: undefined,
    });
    render(<PhoneDetail />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (TanstackRouter.useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: '99' });
    (ReactQuery.useSuspenseQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: { message: 'Not found!' },
    });
    render(<PhoneDetail />);
    expect(screen.getByText(/error: not found!/i)).toBeInTheDocument();
  });

  it('renders phone details with formatted price and image', () => {
    const phoneData = {
      id: 1,
      name: 'Pixel 7',
      price: 999,
      imageFileName: 'pixel7.png',
      description: 'The latest Pixel phone.',
      manufacturer: 'Google',
      color: 'Black',
      screen: 'OLED',
      processor: 'Tensor G2',
      ram: 8,
    };
    (TanstackRouter.useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: '1' });
    (ReactQuery.useSuspenseQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: false,
      data: phoneData,
      error: null,
    });

    render(<PhoneDetail />);
    expect(screen.getByText(/phone details/i)).toBeInTheDocument();
    expect(screen.getByText(phoneData.name)).toBeInTheDocument();
    expect(screen.getByText(phoneData.description)).toBeInTheDocument();
    expect(screen.getByText(/google/i)).toBeInTheDocument();
    expect(screen.getByText(/black/i)).toBeInTheDocument();
    expect(screen.getByText(/oled/i)).toBeInTheDocument();
    expect(screen.getByText(/tensor g2/i)).toBeInTheDocument();
    expect(screen.getByText(/8 gb/i)).toBeInTheDocument();
    expect(screen.getByText('$999.00')).toBeInTheDocument();

    const img = screen.getByAltText(phoneData.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toMatch(/\/images\/pixel7\.png$/);

    const link = screen.getByTestId('catalogue-link') as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.href).toMatch(/\/$/);
    expect(link.textContent).toMatch(/view catalogue/i);
  });
});
