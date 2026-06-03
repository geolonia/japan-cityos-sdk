// Mock dependencies before import
jest.mock('@geolonia/maps-core', () => ({
  GeoloniaMap: class MockMap {},
  keyring: { setApiKey: jest.fn(), setStage: jest.fn(), apiKey: '' }
}));
jest.mock('maplibre-gl', () => ({
  default: {},
  Popup: class MockPopup {}
}));
jest.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
jest.mock('@geolonia/maps-core/css', () => ({}));

// Setup globals before importing index
const mockScript = document.createElement('script');
mockScript.src = 'https://example.com/sdk.js';
Object.defineProperty(document, 'currentScript', {
  value: mockScript,
  writable: true,
});
(window as any).geolonia = { API_KEY: '' };

import { GeoloniaMap } from '../src/index';

describe('getAvailableSpriteSheets', () => {
  it('利用可能なスプライトシート名の配列を返す', () => {
    const result = GeoloniaMap.getAvailableSpriteSheets();
    expect(result).toContain('chizubouken-lab');
    expect(result).toContain('mapfan');
    expect(result).toContain('smartmap');
    expect(result).toContain('basic');
    expect(result.length).toBe(4);
  });
});
