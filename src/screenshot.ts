import type { FBO } from './types';

class Screenshot {
  public static normalizeTexture(
    texture: Float32Array,
    width: number,
    height: number,
  ): Uint8Array {
    const result = new Uint8Array(texture.length);
    let id = 0;
    for (let i = height - 1; i >= 0; i--) {
      for (let j = 0; j < width; j++) {
        const nid = i * width * 4 + j * 4;
        result[nid + 0] = Screenshot.clamp01(texture[id + 0]!) * 255;
        result[nid + 1] = Screenshot.clamp01(texture[id + 1]!) * 255;
        result[nid + 2] = Screenshot.clamp01(texture[id + 2]!) * 255;
        result[nid + 3] = Screenshot.clamp01(texture[id + 3]!) * 255;
        id += 4;
      }
    }
    return result;
  }

  private static clamp01(input: number): number {
    return Math.min(Math.max(input, 0), 1);
  }

  public static framebufferToTexture(target: FBO, gl: WebGL2RenderingContext) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    const length = target.width * target.height * 4;
    const texture = new Float32Array(length);
    gl.readPixels(
      0,
      0,
      target.width,
      target.height,
      gl.RGBA,
      gl.FLOAT,
      texture,
    );
    return texture;
  }

  public static textureToCanvas(
    texture: Uint8Array,
    width: number,
    height: number,
  ) {
    const captureCanvas = document.createElement('canvas');
    const ctx = captureCanvas.getContext('2d')!;
    captureCanvas.width = width;
    captureCanvas.height = height;

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(texture);
    ctx.putImageData(imageData, 0, 0);

    return captureCanvas;
  }

  public static downloadURI(filename: string, uri: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export { Screenshot };
