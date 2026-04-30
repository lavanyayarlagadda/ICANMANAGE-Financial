import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

vi.mock('@mui/icons-material', () => ({
  __esModule: true,
  default: () => null,
  // Add common icons used in tests if needed, or just return a dummy for all
  Visibility: () => 'Visibility',
  VisibilityOff: () => 'VisibilityOff',
  LockOutlined: () => 'LockOutlined',
  ArrowBack: () => 'ArrowBack',
  Search: () => 'Search',
  ErrorOutline: () => 'ErrorOutline',
}));
