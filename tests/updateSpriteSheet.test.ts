import { updateSpriteSheet } from '../src/utils/osmPoiUtils';

describe('updateSpriteSheet', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getStyle: jest.fn(),
      setLayoutProperty: jest.fn()
    };
  });

  it('icon-imageがexpressionの場合、spriteKeyを置き換える', () => {
    map.getStyle.mockReturnValue({
      layers: [
        {
          id: 'osm-school',
          layout: {
            'icon-image': ['concat', 'basic', ':', 'school']
          }
        }
      ]
    });
    updateSpriteSheet(map, 'school', 'chizubouken-lab');
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'osm-school',
      'icon-image',
      ['concat', 'chizubouken-lab', ':', 'school']
    );
  });

  it('icon-imageがstringの場合、spriteKeyを置き換える', () => {
    map.getStyle.mockReturnValue({
      layers: [
        {
          id: 'osm-school',
          layout: {
            'icon-image': 'basic:school'
          }
        }
      ]
    });
    updateSpriteSheet(map, 'school', 'chizubouken-lab');
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'osm-school',
      'icon-image',
      'chizubouken-lab:school'
    );
  });

  it('対象レイヤーが存在しない場合は何もしない', () => {
    map.getStyle.mockReturnValue({
      layers: [
        {
          id: 'osm-restaurant',
          layout: {
            'icon-image': ['concat', 'basic', ':', 'restaurant']
          }
        }
      ]
    });
    updateSpriteSheet(map, 'school', 'chizubouken-lab');
    expect(map.setLayoutProperty).not.toHaveBeenCalled();
  });
});
