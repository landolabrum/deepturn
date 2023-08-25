
export interface UiIconStrokeOptions {
  width: number;
  lineCap?: 'round' | 'square' | 'butt';
  lineJoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';
}

export interface UiIconDefinition {
  // Option 1
  width?: number; // viewbox width
  height?: number; // viewbox height
  path?: string | string[]; // single path or path array
  stroke?: UiIconStrokeOptions; // single path or path array
  glow?: string;
  // stroke?: boolean;

  // Option 2
  src?: string; // src to SVG File

  // Option 3
  html?: string;
}

export type UiIconSet = { [key: string]: UiIconDefinition };


// Font Awesom
export type IconPrefix = "fas" | "far" | "fal" | "fat" | "fad" | "fab" | "fak" ;
export type IconPathData = string | string[]
export interface IconLookup {
  prefix: IconPrefix;
  // IconName is defined in the code that will be generated at build time and bundled with this file.
   // iconName: IconName;
   iconName: string;
}

export interface IconDefinition extends IconLookup {
  icon: [
    number, // width
    number, // height
    string[], // ligatures
    string, // unicode
    IconPathData // svgPathData
  ];
}