import type { HSVColor, RGBColor } from './types';

class Color {
  public static generateColor(
    colorPalette: string[],
    brightness: number,
  ): RGBColor {
    let hue: number;
    let saturation: number;
    if (!(colorPalette.length > 0)) {
      hue = Math.random();
      saturation = 1.0;
    } else {
      const randomIndex = Math.floor(Math.random() * colorPalette.length);
      const color = colorPalette[randomIndex]!;
      const HSVcolor = Color.HEXtoHSV(color);
      hue = HSVcolor.h;
      saturation = HSVcolor.s;
    }

    const c = Color.HSVtoRGB(hue, saturation, brightness);
    c.r *= 0.1;
    c.g *= 0.1;
    c.b *= 0.1;
    return c;
  }

  public static HEXtoHSV(hex: string): HSVColor {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h: number, s: number;

    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / (max - min) + 6) % 6;
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    h /= 6;

    if (max === 0) {
      s = 0;
    } else {
      s = (max - min) / max;
    }

    const v = max;

    return { h, s, v };
  }

  public static HEXtoRGB(hex: string): RGBColor {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  }

  public static HSVtoRGB(h: number, s: number, v: number): RGBColor {
    let r = 0,
      g = 0,
      b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }

    return {
      r,
      g,
      b,
    };
  }

  public static normalizeColor(input: RGBColor): RGBColor {
    const output = {
      r: input.r / 255,
      g: input.g / 255,
      b: input.b / 255,
    };
    return output;
  }
}

export { Color };
