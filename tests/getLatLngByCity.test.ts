import { normalize } from '@geolonia/normalize-japanese-addresses';

jest.mock('@geolonia/normalize-japanese-addresses', () => ({
  normalize: jest.fn(),
}));

const mockedNormalize = normalize as jest.MockedFunction<typeof normalize>;

/**
 * getLatLngByCity のロジックを直接テストする
 * (GeoloniaMap クラスは maplibre-gl に依存しモジュール副作用があるため、ロジックのみ検証)
 */
async function getLatLngByCity(prefName: string, cityName: string): Promise<[number, number] | null> {
  const result = await normalize(prefName + cityName);
  const point = (result as any)?.point;
  if (point) {
    return [point.lng, point.lat];
  }
  return null;
}

describe('getLatLngByCity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('都道府県+市区町村名から座標を取得できる', async () => {
    mockedNormalize.mockResolvedValue({
      pref: '沖縄県',
      city: '那覇市',
      town: '',
      addr: '',
      lat: 26.2124,
      lng: 127.6792,
      level: 2,
      point: { lat: 26.2124, lng: 127.6792 },
    } as any);

    const result = await getLatLngByCity('沖縄県', '那覇市');
    expect(mockedNormalize).toHaveBeenCalledWith('沖縄県那覇市');
    expect(result).toEqual([127.6792, 26.2124]);
  });

  it('座標が取得できない場合はnullを返す', async () => {
    mockedNormalize.mockResolvedValue({
      pref: '',
      city: '',
      town: '',
      addr: '',
      lat: null,
      lng: null,
      level: 0,
      point: undefined,
    } as any);

    const result = await getLatLngByCity('存在しない県', '存在しない市');
    expect(result).toBeNull();
  });
});
