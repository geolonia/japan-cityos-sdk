import { addOsmSprite } from '../src/utils/osmPoiUtils';


describe('addOsmSprite', () => {
  let map: any;
  const spriteSheetUrl: {[key: string]: string} = {
    'chizubouken-lab': 'https://geolonia.github.io/chizubouken-lab-sprite/sprite',
    'mapfan': 'https://geolonia.github.io/mapfandb-sprite/sprite',
    'smartmap': 'https://geolonia.github.io/custom-smartmap-sprite/sprite',
    'basic': 'https://geoloniamaps.github.io/basic-v1/basic-v1',
  };

  beforeEach(() => {
    map = {
      getStyle: jest.fn(),
      setStyle: jest.fn()
    };
  });

  it('spriteが未設定なら、渡したspriteのみ追加', () => {
    map.getStyle.mockReturnValue({});
    addOsmSprite(map, { 'basic': spriteSheetUrl['basic'] }, spriteSheetUrl);
    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [{ id: "basic", url: "https://geoloniamaps.github.io/basic-v1/basic-v1" }]
    });
  });

  it('spriteがオブジェクトで、渡したspriteがなければ追加', () => {
    map.getStyle.mockReturnValue({ sprite: [{ id: "default", url: "foo" }] });
    addOsmSprite(map, { 'smartmap': spriteSheetUrl['smartmap'] }, spriteSheetUrl);
    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [
        { id: "default", url: "foo" },
        { id: "smartmap", url: "https://geolonia.github.io/custom-smartmap-sprite/sprite" }
      ]
    });
  });

  it('spriteがオブジェクトで、渡したspriteが既にあれば何もしない', () => {
    map.getStyle.mockReturnValue({ sprite: [{ id: "basic", url: spriteSheetUrl['basic'] }] });
    addOsmSprite(map, { 'basic': spriteSheetUrl['basic'] }, spriteSheetUrl);
    expect(map.setStyle).not.toHaveBeenCalled();
  });

  it('spriteがstringで、spriteSheetUrlにURLが存在する場合はspriteSheetUrlのkey名でspriteに追加', () => {
    map.getStyle.mockReturnValue({ sprite: spriteSheetUrl['mapfan'] });
    addOsmSprite(map, { 'basic': spriteSheetUrl['basic'] }, spriteSheetUrl);

    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [
        { id: "mapfan", url: spriteSheetUrl['mapfan'] },
        { id: "basic", url: spriteSheetUrl['basic'] }
      ]
    });
  });

  it('spriteがstringで、spriteListにスプライトがなかったら、既存のspriteをdefaultで、渡したspriteを配列で設定', () => {
    map.getStyle.mockReturnValue({ sprite: "https://example.com/sprite.json" });
    addOsmSprite(map, { 'chizubouken-lab': spriteSheetUrl['chizubouken-lab'] }, spriteSheetUrl);
    expect(map.setStyle).toHaveBeenCalledWith({
      sprite: [
        { id: "default", url: "https://example.com/sprite.json" },
        { id: "chizubouken-lab", url: spriteSheetUrl['chizubouken-lab'] }
      ]
    });
  });
});
