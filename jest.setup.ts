jest.mock("react-native-mmkv", () => {
  const mockMMKVInstance = {
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    clearAll: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  return {
    createMMKV: jest.fn().mockImplementation(() => mockMMKVInstance),
    MMKV: jest.fn().mockImplementation(() => mockMMKVInstance),
  };
});
