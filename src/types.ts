export type ExtraContext = {
  formatRGBA: { internalFormat: number; format: number };
  formatRG: { internalFormat: number; format: number };
  formatR: { internalFormat: number; format: number };
  halfFloatTexType: number;
  supportLinearFiltering: OES_texture_float_linear;
};

export type FBO = {
  texture: WebGLTexture | null;
  fbo: WebGLFramebuffer | null;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

export type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

export type TextureInfo = {
  texture: WebGLTexture;
  width: number;
  height: number;
  attach(id: number): number;
};

export type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export type HSVColor = {
  h: number;
  s: number;
  v: number;
};

type ConfigOptions = {
  simResolution: number;
  dyeResolution: number;
  captureResolution: number;
  densityDissipation: number;
  velocityDissipation: number;
  pressure: number;
  pressureIterations: number;
  curl: number;
  splatRadius: number;
  splatForce: number;
  shading: boolean;
  colorful: boolean;
  colorUpdateSpeed: number;
  colorPalette: string[];
  hover: boolean;
  backgroundColor: string;
  inverted: boolean;
  transparent: boolean;
  brightness: number;
  bloom: boolean;
  bloomIterations: number;
  bloomResolution: number;
  bloomIntensity: number;
  bloomThreshold: number;
  bloomSoftKnee: number;
  sunrays: boolean;
  sunraysResolution: number;
  sunraysWeight: number;
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type Config = AtLeastOne<ConfigOptions>;
