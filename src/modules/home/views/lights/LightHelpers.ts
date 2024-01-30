export const calculateHexFromHueSatBri = (hue: number, sat: number, bri: number) => {
    // Convert hue to degrees (0-360)
    const hueDegrees = (hue / 65535) * 360;
  
    // Calculate RGB values from HSB
    let r, g, b;
    const c = (bri / 254) * (sat / 254);
    const x = c * (1 - Math.abs(((hueDegrees / 60) % 2) - 1));
    const m = (bri / 254) - c / 2;
  
    if (hueDegrees >= 0 && hueDegrees < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (hueDegrees >= 60 && hueDegrees < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (hueDegrees >= 120 && hueDegrees < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (hueDegrees >= 180 && hueDegrees < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (hueDegrees >= 240 && hueDegrees < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
  
    // Scale RGB values to 0-255 and convert to hex
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
  
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    return hex;
  };
  