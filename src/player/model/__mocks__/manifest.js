export const Manifest = jest.fn(() => ({ generateUrl: jest.fn(), getCurrentPeriod: jest.fn() }));

Manifest.createFrom = jest.fn(() => new Manifest());
