import { addOsmSprite } from '../src/utils/osmPoiUtils';


describe('addOsmSprite', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getStyle: jest.fn(),
      setStyle: jest.fn()
    };
  });

  it('spriteが未設定ならosmのみ追加', () => {
    map.getStyle.mockReturnValue({});
    addOsmSprite(map, 'railway');
    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [{ id: "osm", url: "https://geoloniamaps.github.io/basic-v1/basic-v1" }]
    });
  });

  it('spriteがオブジェクトでosmがなければ追加', () => {
    map.getStyle.mockReturnValue({ sprite: [{ id: "default", url: "foo" }] });
    addOsmSprite(map, 'railway');
    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [
        { id: "default", url: "foo" },
        { id: "osm", url: "https://geoloniamaps.github.io/basic-v1/basic-v1" }
      ]
    });
  });

  it('spriteがオブジェクトでosmが既にあれば何もしない', () => {
    map.getStyle.mockReturnValue({ sprite: [{ id: "osm", url: "bar" }] });
    addOsmSprite(map, 'railway');
    expect(map.setStyle).not.toHaveBeenCalled();
  });

  it('spriteがstringならdefaultとosmを配列で設定', () => {
    map.getStyle.mockReturnValue({ sprite: "https://example.com/sprite.json" });
    addOsmSprite(map, 'railway');
    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [
        { id: "default", url: "https://example.com/sprite.json" },
        { id: "osm", url: "https://geoloniamaps.github.io/basic-v1/basic-v1" }
      ]
    });
  });
});
