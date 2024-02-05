import { UiIconDefinition } from '../types/icons';
import Icons from '../icons/icons';

interface SvgOptions {
  width?: number;
  height?: number;
  color?: string;
}

export default class IconHelper {
  public static getIcon(id: string): UiIconDefinition | undefined {
    return Icons[id];
  }

  public static getIconSvg(id: string, options?: SvgOptions): string {
    return this.buildSvgFromIcon(Icons[id], options);
  }

  public static buildSvgFromIcon(
    icon: UiIconDefinition,
    options?: SvgOptions,
  ): string {
    if (!icon.path) {
      throw new Error('Missing Icon Path');
    }
    if (!icon.width) {
      throw new Error('Missing Icon Width');
    }
    if (!icon.height) {
      throw new Error('Missing Icon Height');
    }

    let width = icon.width; // 100
    let height = icon.height; // 200
    let color = icon.color || 'currentColor';
    if (options) {
      if (options.width != null || options.height != null) {
        if (options.width) width = options.width;
        if (options.height) height = options.height;
        if (options.height == null)
          height = Math.ceil((width / icon.width) * icon.height);
        if (options.width == null)
          width = Math.ceil((height / icon.height) * icon.width);
      }
      if(options.color){
        color=options.color
      }
    }

    if (typeof icon.path !== 'string') {
      throw new TypeError(
        'Expected a single string path. Array of paths not implemented.',
      );
    }

    const html =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      icon.width +
      ' ' +
      icon.height +
      `" fill="${color}">` +
      '<path d="' +
      icon.path +
      '"/>' +
      '</svg>';

    return html;
  }
}

/* © Webstack, MIT License */
