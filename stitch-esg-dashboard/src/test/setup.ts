import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase with proper structure
const mockDb = {
  app: {
    options: {
      databaseURL: 'https://mock-project.firebaseio.com',
    },
  },
};

vi.mock('@/firebase', () => ({
  db: mockDb,
  auth: {},
  storage: {},
}));

// Create mock functions
const mockCollection = vi.fn();
const mockDoc = vi.fn((db: any, path: string) => ({ path }));
const mockGetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockOnSnapshot = vi.fn();
const mockUpdateDoc = vi.fn();

// Mock Firebase Firestore with all exports
vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  onSnapshot: mockOnSnapshot,
  updateDoc: mockUpdateDoc,
  Timestamp: {
    fromDate: vi.fn((date: Date) => ({
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: (date.getTime() % 1000) * 1000000,
    })),
    now: vi.fn(() => ({
      toDate: () => new Date(),
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    })),
  },
  QuerySnapshot: vi.fn(),
  DocumentData: vi.fn(),
}));

// Export mocks for use in tests
export {
  mockCollection,
  mockDoc,
  mockGetDoc,
  mockGetDocs,
  mockQuery,
  mockWhere,
  mockOrderBy,
  mockLimit,
  mockOnSnapshot,
  mockUpdateDoc,
};

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
