/* eslint no-console: "off" */

jasmine.getEnv().beforeEach(() => {
  console.error = (...args) => {
    throw new Error(...args);
  };

  global.__DEBUG_MODE__ = false;
  global.__MOCK__ = false;
  global.__CLIENT__ = true;
  global.__SERVER__ = false;

  window.fetch = jest.fn(() =>
    Promise.resolve({
      text: jest.fn(() => ''),
    }),
  );
});

Object.defineProperty(window, 'localStorage', {
  writable: true,
});

Object.defineProperties(window.navigator, {
  userAgent: {
    value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359',
    writable: false,
  },
});
