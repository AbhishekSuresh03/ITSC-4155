import { configure } from '@testing-library/react-native';

// Import built-in Jest matchers
import '@testing-library/react-native/extend-expect';

configure({ concurrentRoot: true });

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  }));