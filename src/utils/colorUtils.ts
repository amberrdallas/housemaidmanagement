// Color utility functions for accessibility and color manipulation

export interface ColorContrast {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  isAccessible: boolean;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Convert hex to RGB
export const hexToRgb = (hex: string): RGBColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number): HSLColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): RGBColor => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// Calculate relative luminance
export const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check color contrast accessibility
export const checkContrast = (foreground: string, background: string): ColorContrast => {
  const ratio = getContrastRatio(foreground, background);
  
  let level: ColorContrast['level'];
  let isAccessible = false;
  
  if (ratio >= 7) {
    level = 'AAA';
    isAccessible = true;
  } else if (ratio >= 4.5) {
    level = 'AA';
    isAccessible = true;
  } else if (ratio >= 3) {
    level = 'A';
    isAccessible = false;
  } else {
    level = 'FAIL';
    isAccessible = false;
  }
  
  return { ratio, level, isAccessible };
};

// Generate accessible color variations
export const generateAccessibleColor = (baseColor: string, targetBackground: string, isLargeText = false): string => {
  const targetRatio = isLargeText ? 3 : 4.5;
  const rgb = hexToRgb(baseColor);
  const bgRgb = hexToRgb(targetBackground);
  
  if (!rgb || !bgRgb) return baseColor;
  
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Try adjusting lightness to meet contrast requirements
  for (let l = 5; l <= 95; l += 5) {
    const testRgb = hslToRgb(hsl.h, hsl.s, l);
    const testHex = rgbToHex(testRgb.r, testRgb.g, testRgb.b);
    const contrast = getContrastRatio(testHex, targetBackground);
    
    if (contrast >= targetRatio) {
      return testHex;
    }
  }
  
  // If we can't meet the target, return black or white based on background
  return bgLuminance > 0.5 ? '#000000' : '#ffffff';
};

// Validate hex color format
export const isValidHexColor = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

// Convert any color format to hex
export const normalizeColor = (color: string): string => {
  // If already hex, validate and return
  if (color.startsWith('#')) {
    return isValidHexColor(color) ? color : '#000000';
  }
  
  // Handle rgb() format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return rgbToHex(r, g, b);
  }
  
  // Handle hsl() format
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }
  
  // Default fallback
  return '#000000';
};

// Generate color palette variations
export const generateColorPalette = (baseColor: string): string[] => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette: string[] = [];
  
  // Generate lightness variations
  const lightnesses = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  
  lightnesses.forEach(l => {
    const newRgb = hslToRgb(hsl.h, hsl.s, l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  return palette;
};