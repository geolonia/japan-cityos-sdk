import { normalize } from '@geolonia/normalize-japanese-addresses';
import { resolveLatLng } from '../src/utils/resolveLatLng';

jest.mock('@geolonia/normalize-japanese-addresses', () => ({
  normalize: jest.fn(),
}));

const mockedNormalize = normalize as jest.MockedFunction<typeof normalize>;

describe('getLatLngByCity (resolveLatLng)', () => {
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

    const result = await resolveLatLng('沖縄県那覇市');
    expect(mockedNormalize).toHaveBeenCalledWith('沖縄県那覇市');
    expect(result).toEqual([127.6792, 26.2124]);
  });

  it('都道府県名のみから座標を取得できる', async () => {
    mockedNormalize.mockResolvedValue({
      pref: '沖縄県',
      city: '',
      town: '',
      addr: '',
      lat: 26.3344,
      lng: 127.7809,
      level: 1,
      point: { lat: 26.3344, lng: 127.7809 },
    } as any);

    const result = await resolveLatLng('沖縄県');
    expect(mockedNormalize).toHaveBeenCalledWith('沖縄県');
    expect(result).toEqual([127.7809, 26.3344]);
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

    const result = await resolveLatLng('存在しない県存在しない市');
    expect(result).toBeNull();
  });
});
