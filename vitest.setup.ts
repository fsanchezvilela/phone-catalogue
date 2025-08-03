import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
  var invalidateMock: ReturnType<typeof vi.fn>;

  var useLoaderDataMock: ReturnType<typeof vi.fn>;

  var updateCountMock: ReturnType<typeof vi.fn>;
}
