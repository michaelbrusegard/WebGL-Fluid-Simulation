import { Color } from './color';
import { Material } from './material';
import { Pointer } from './pointer';
import { Programs } from './programs';
import { Screenshot } from './screenshot';
import { Shaders } from './shaders';
import { Texture } from './texture';
import type {
  DoubleFBO,
  ExtraContext,
  FBO,
  RGBColor,
  TextureInfo,
} from './types';

class Simulation {
  public simResolution = 128;
  public dyeResolution = 1024;
  public captureResolution = 512;
  public densityDissipation = 1;
  public velocityDissipation = 0.2;
  public pressure = 0.8;
  public pressureIterations = 20;
  public curl = 30;
  public splatRadius = 0.25;
  public splatForce = 6000;
  public shading = true;
  public colorful = true;
  public colorUpdateSpeed = 10;
  public colorPalette: string[] = [];
  public hover = true;
  public backColor = '#000000';
  public transparent = false;
  public brightness = 0.5;
  public bloom = true;
  public bloomIterations = 8;
  public bloomResolution = 256;
  public bloomIntensity = 0.8;
  public bloomThreshold = 0.6;
  public bloomSoftKnee = 0.7;
  public sunrays = true;
  public sunraysResolution = 196;
  public sunraysWeight = 1.0;
  public paused = false;
  public drawWhilePaused = false;
  private _inverted = false;
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private ext: ExtraContext;
  private splatStack: number[] = [];
  private pointers: Pointer[] = [];
  private programs: Programs;
  private bloomFramebuffers: FBO[] = [];
  private ditheringTexture: TextureInfo;
  private displayMaterial: Material;
  private lastUpdateTime: number = Date.now();
  private colorUpdateTimer = 0.0;
  private _dye!: DoubleFBO;
  private _velocity!: DoubleFBO;
  private _divergence!: FBO;
  private _curl!: FBO;
  private _pressure!: DoubleFBO;
  private _bloom!: FBO;
  private _sunrays!: FBO;
  private _sunraysTemp!: FBO;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    container.appendChild(this.canvas);
    this.resizeCanvas();

    this.inverted = false;

    this.pointers.push(new Pointer(this.colorPalette, this.brightness));
    const { gl, ext } = this.getWebGLContext();
    this.gl = gl;
    this.ext = ext;

    if (this.isMobile()) {
      this.dyeResolution = 512;
    }
    if (!this.ext.supportLinearFiltering) {
      this.dyeResolution = 512;
      this.shading = false;
      this.bloom = false;
      this.sunrays = false;
    }

    const shaders = new Shaders(this.gl, this.ext);

    this.blitInit();

    this.ditheringTexture = Texture.ditheringTexture(this.gl);

    this.programs = new Programs(this.gl, shaders);

    this.displayMaterial = new Material(
      shaders.baseVertexShader,
      shaders.displayShaderSource,
      this.gl,
    );

    this.updateKeywords();
    this.initFramebuffers();

    this.update = this.update.bind(this);
    this.update();

    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      const posX = this.scaleByPixelRatio(event.offsetX);
      const posY = this.scaleByPixelRatio(event.offsetY);
      let pointer = this.pointers.find((p) => p.id == -1);
      if (!pointer) {
        pointer = new Pointer(this.colorPalette, this.brightness);
      }
      pointer.updatePointerDownData(
        -1,
        posX,
        posY,
        this.canvas,
        this.colorPalette,
        this.brightness,
      );
    });

    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const posX = this.scaleByPixelRatio(event.offsetX);
      const posY = this.scaleByPixelRatio(event.offsetY);
      let pointer = this.pointers.find((p) => p.id == -1);
      if (!pointer) {
        pointer = new Pointer(this.colorPalette, this.brightness);
      }
      pointer.updatePointerMoveData(posX, posY, this.canvas, this.hover);
    });

    window.addEventListener('mouseup', () => {
      if (!this.hover) {
        this.pointers[0]!.updatePointerUpData();
      }
    });

    this.canvas.addEventListener(
      'touchstart',
      (event: TouchEvent) => {
        const touches = event.targetTouches;
        while (touches.length >= this.pointers.length)
          this.pointers.push(new Pointer(this.colorPalette, this.brightness));
        for (let i = 0; i < touches.length; i++) {
          const posX = this.scaleByPixelRatio(touches[i]!.pageX);
          const posY = this.scaleByPixelRatio(touches[i]!.pageY);
          this.pointers[i + 1]!.updatePointerDownData(
            touches[i]!.identifier,
            posX,
            posY,
            this.canvas,
            this.colorPalette,
            this.brightness,
          );
        }
      },
      { passive: false, capture: true },
    );

    this.canvas.addEventListener(
      'touchmove',
      (event: TouchEvent) => {
        const touches = event.targetTouches;
        for (let i = 0; i < touches.length; i++) {
          const pointer = this.pointers[i + 1]!;
          const posX = this.scaleByPixelRatio(touches[i]!.pageX);
          const posY = this.scaleByPixelRatio(touches[i]!.pageY);
          pointer.updatePointerMoveData(posX, posY, this.canvas, this.hover);
        }
      },
      { passive: false, capture: true },
    );

    window.addEventListener('touchend', (event: TouchEvent) => {
      const touches = event.changedTouches;
      for (const touch of touches) {
        const pointer = this.pointers.find(
          (pointer) => pointer.id === touch.identifier,
        );
        if (!pointer) continue;
        pointer.updatePointerUpData();
      }
    });
  }

  private scaleByPixelRatio(input: number): number {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }

  private resizeCanvas(): boolean {
    const width = this.scaleByPixelRatio(this.canvas.clientWidth);
    const height = this.scaleByPixelRatio(this.canvas.clientHeight);
    if (this.canvas.width != width || this.canvas.height != height) {
      this.canvas.width = width;
      this.canvas.height = height;
      return true;
    }
    return false;
  }

  private supportRenderTextureFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): boolean {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      4,
      4,
      0,
      format,
      type,
      null,
    );

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status == gl.FRAMEBUFFER_COMPLETE;
  }

  private getSupportedFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): { internalFormat: number; format: number } | null {
    if (!this.supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return this.getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return this.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }

    return {
      internalFormat,
      format,
    };
  }

  private getWebGLContext(): { gl: WebGL2RenderingContext; ext: ExtraContext } {
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl = this.canvas.getContext('webgl2', params) as WebGL2RenderingContext;
    const isWebGL2 = !!gl;
    if (!isWebGL2)
      gl =
        (this.canvas.getContext('webgl', params) as WebGL2RenderingContext) ??
        (this.canvas.getContext(
          'experimental-webgl',
          params,
        ) as WebGLRenderingContext);

    let halfFloat;
    let supportLinearFiltering;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear')!;
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension(
        'OES_texture_half_float_linear',
      )!;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2
      ? gl.HALF_FLOAT
      : halfFloat
        ? halfFloat.HALF_FLOAT_OES
        : 0;
    let formatRGBA;
    let formatRG;
    let formatR;

    if (isWebGL2) {
      formatRGBA = this.getSupportedFormat(
        gl,
        gl.RGBA16F,
        gl.RGBA,
        halfFloatTexType,
      )!;
      formatRG = this.getSupportedFormat(
        gl,
        gl.RG16F,
        gl.RG,
        halfFloatTexType,
      )!;
      formatR = this.getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)!;
    } else {
      formatRGBA = this.getSupportedFormat(
        gl,
        gl.RGBA,
        gl.RGBA,
        halfFloatTexType,
      )!;
      formatRG = this.getSupportedFormat(
        gl,
        gl.RGBA,
        gl.RGBA,
        halfFloatTexType,
      )!;
      formatR = this.getSupportedFormat(
        gl,
        gl.RGBA,
        gl.RGBA,
        halfFloatTexType,
      )!;
    }

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    };
  }

  private isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  public updateKeywords() {
    const displayKeywords: string[] = [];
    if (this.shading) displayKeywords.push('SHADING');
    if (this.bloom) displayKeywords.push('BLOOM');
    if (this.sunrays) displayKeywords.push('SUNRAYS');
    this.displayMaterial.setKeywords(displayKeywords);
  }

  public initFramebuffers() {
    const simRes = this.getResolution(this.simResolution);
    const dyeRes = this.getResolution(this.dyeResolution);

    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const rg = this.ext.formatRG;
    const r = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST;

    this.gl.disable(this.gl.BLEND);

    if (!this._dye)
      this._dye = this.createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );
    else
      this._dye = this.resizeDoubleFBO(
        this._dye,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );

    if (!this._velocity)
      this._velocity = this.createDoubleFBO(
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      );
    else
      this._velocity = this.resizeDoubleFBO(
        this._velocity,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      );

    this._divergence = this.createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST,
    );
    this._curl = this.createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST,
    );
    this._pressure = this.createDoubleFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST,
    );

    this.initBloomFramebuffers();
    this.initSunraysFramebuffers();
  }

  private getResolution(resolution: number): {
    width: number;
    height: number;
  } {
    let aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    if (aspectRatio < 1) {
      aspectRatio = 1.0 / aspectRatio;
    }

    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);

    if (this.gl.drawingBufferWidth > this.gl.drawingBufferHeight)
      return { width: max, height: min };
    else return { width: min, height: max };
  }

  private createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    let fbo1 = this.createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = this.createFBO(w, h, internalFormat, format, type, param);

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  private resizeFBO(
    target: FBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    const newFBO = this.createFBO(w, h, internalFormat, format, type, param);
    this.programs.copyProgram.bind();
    this.gl.uniform1i(
      this.programs.copyProgram.uniforms.uTexture!,
      target.attach(0),
    );
    this.blit(newFBO);
    return newFBO;
  }

  private resizeDoubleFBO(
    target: DoubleFBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    if (target.width === w && target.height === h) return target;
    target.read = this.resizeFBO(
      target.read,
      w,
      h,
      internalFormat,
      format,
      type,
      param,
    );
    target.write = this.createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
  }

  private createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    this.gl.activeTexture(this.gl.TEXTURE0);
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      param,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      param,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      format,
      type,
      null,
    );

    const fbo: WebGLFramebuffer | null = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0,
    );
    this.gl.viewport(0, 0, w, h);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const texelSizeX = 1.0 / w;
    const texelSizeY = 1.0 / h;

    const gl = this.gl;
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  private initBloomFramebuffers() {
    const res = this.getResolution(this.bloomResolution);

    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST;

    this._bloom = this.createFBO(
      res.width,
      res.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering,
    );

    this.bloomFramebuffers.length = 0;
    for (let i = 0; i < this.bloomIterations; i++) {
      const width = res.width >> (i + 1);
      const height = res.height >> (i + 1);

      if (width < 2 || height < 2) break;

      const fbo = this.createFBO(
        width,
        height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );
      this.bloomFramebuffers.push(fbo);
    }
  }

  private initSunraysFramebuffers() {
    const res = this.getResolution(this.sunraysResolution);

    const texType = this.ext.halfFloatTexType;
    const r = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST;

    this._sunrays = this.createFBO(
      res.width,
      res.height,
      r.internalFormat,
      r.format,
      texType,
      filtering,
    );
    this._sunraysTemp = this.createFBO(
      res.width,
      res.height,
      r.internalFormat,
      r.format,
      texType,
      filtering,
    );
  }

  private blitInit() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      this.gl.STATIC_DRAW,
    );
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      this.gl.STATIC_DRAW,
    );
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(0);
  }

  private blit(target: FBO | null, clear = false) {
    if (target === null) {
      this.gl.viewport(
        0,
        0,
        this.gl.drawingBufferWidth,
        this.gl.drawingBufferHeight,
      );
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    } else {
      this.gl.viewport(0, 0, target.width, target.height);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.fbo);
    }
    if (clear) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  }

  public multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = Color.generateColor(this.colorPalette, this.brightness);
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      this.splat(x, y, dx, dy, color);
    }
  }

  public splat(x: number, y: number, dx: number, dy: number, color: RGBColor) {
    this.programs.splatProgram.bind();
    this.gl.uniform1i(
      this.programs.splatProgram.uniforms.uTarget!,
      this._velocity.read.attach(0),
    );
    this.gl.uniform1f(
      this.programs.splatProgram.uniforms.aspectRatio!,
      this.canvas.width / this.canvas.height,
    );
    this.gl.uniform2f(this.programs.splatProgram.uniforms.point!, x, y);
    this.gl.uniform3f(this.programs.splatProgram.uniforms.color!, dx, dy, 0.0);
    this.gl.uniform1f(
      this.programs.splatProgram.uniforms.radius!,
      this.correctRadius(this.splatRadius / 100.0),
    );
    this.blit(this._velocity.write);
    this._velocity.swap();

    this.gl.uniform1i(
      this.programs.splatProgram.uniforms.uTarget!,
      this._dye.read.attach(0),
    );
    this.gl.uniform3f(
      this.programs.splatProgram.uniforms.color!,
      color.r,
      color.g,
      color.b,
    );
    this.blit(this._dye.write);
    this._dye.swap();
  }

  private correctRadius(radius: number): number {
    const aspectRatio = this.canvas.width / this.canvas.height;
    if (aspectRatio > 1) {
      radius *= aspectRatio;
    }
    return radius;
  }

  private update() {
    const dt = this.calcDeltaTime();
    if (this.resizeCanvas()) this.initFramebuffers();

    this.updateColors(dt);
    this.applyInputs();

    if (!this.paused) this.step(dt);

    this.render(null);

    // This is bound in the constructor, so it's safe to call here
    // eslint-disable-next-line
    requestAnimationFrame(this.update);
  }

  private calcDeltaTime(): number {
    const now = Date.now();
    let dt = (now - this.lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    this.lastUpdateTime = now;
    return dt;
  }

  private updateColors(dt: number) {
    if (!this.colorful) return;

    this.colorUpdateTimer += dt * this.colorUpdateSpeed;
    if (this.colorUpdateTimer >= 1) {
      this.colorUpdateTimer = this.wrap(this.colorUpdateTimer, 0, 1);
      this.pointers.forEach((p: Pointer) => {
        p.color = Color.generateColor(this.colorPalette, this.brightness);
      });
    }
  }

  private wrap(value: number, min: number, max: number): number {
    const range: number = max - min;
    if (range == 0) return min;
    return ((value - min) % range) + min;
  }

  private applyInputs() {
    if (this.splatStack.length > 0) {
      this.multipleSplats(this.splatStack.pop()!);
    }
    this.pointers.forEach((p) => {
      if (p.moved) {
        p.moved = false;
        this.splatPointer(p);
      }
    });
  }

  private splatPointer(pointer: Pointer) {
    if (this.paused && !this.drawWhilePaused) return;
    const dx = pointer.deltaX * this.splatForce;
    const dy = pointer.deltaY * this.splatForce;
    this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  private step(dt: number) {
    this.gl.disable(this.gl.BLEND);

    this.programs.curlProgram.bind();
    this.gl.uniform2f(
      this.programs.curlProgram.uniforms.texelSize!,
      this._velocity.texelSizeX,
      this._velocity.texelSizeY,
    );
    this.gl.uniform1i(
      this.programs.curlProgram.uniforms.uVelocity!,
      this._velocity.read.attach(0),
    );
    this.blit(this._curl);

    this.programs.vorticityProgram.bind();
    this.gl.uniform2f(
      this.programs.vorticityProgram.uniforms.texelSize!,
      this._velocity.texelSizeX,
      this._velocity.texelSizeY,
    );
    this.gl.uniform1i(
      this.programs.vorticityProgram.uniforms.uVelocity!,
      this._velocity.read.attach(0),
    );
    this.gl.uniform1i(
      this.programs.vorticityProgram.uniforms.uCurl!,
      this._curl.attach(1),
    );
    this.gl.uniform1f(this.programs.vorticityProgram.uniforms.curl!, this.curl);
    this.gl.uniform1f(this.programs.vorticityProgram.uniforms.dt!, dt);
    this.blit(this._velocity.write);
    this._velocity.swap();

    this.programs.divergenceProgram.bind();
    this.gl.uniform2f(
      this.programs.divergenceProgram.uniforms.texelSize!,
      this._velocity.texelSizeX,
      this._velocity.texelSizeY,
    );
    this.gl.uniform1i(
      this.programs.divergenceProgram.uniforms.uVelocity!,
      this._velocity.read.attach(0),
    );
    this.blit(this._divergence);

    this.programs.clearProgram.bind();
    this.gl.uniform1i(
      this.programs.clearProgram.uniforms.uTexture!,
      this._pressure.read.attach(0),
    );
    this.gl.uniform1f(
      this.programs.clearProgram.uniforms.value!,
      this.pressure,
    );
    this.blit(this._pressure.write);
    this._pressure.swap();

    this.programs.pressureProgram.bind();
    this.gl.uniform2f(
      this.programs.pressureProgram.uniforms.texelSize!,
      this._velocity.texelSizeX,
      this._velocity.texelSizeY,
    );
    this.gl.uniform1i(
      this.programs.pressureProgram.uniforms.uDivergence!,
      this._divergence.attach(0),
    );
    for (let i = 0; i < this.pressureIterations; i++) {
      this.gl.uniform1i(
        this.programs.pressureProgram.uniforms.uPressure!,
        this._pressure.read.attach(1),
      );
      this.blit(this._pressure.write);
      this._pressure.swap();
    }

    this.programs.gradienSubtractProgram.bind();
    this.gl.uniform2f(
      this.programs.gradienSubtractProgram.uniforms.texelSize!,
      this._velocity.texelSizeX,
      this._velocity.texelSizeY,
    );
    this.gl.uniform1i(
      this.programs.gradienSubtractProgram.uniforms.uPressure!,
      this._pressure.read.attach(0),
    );
    this.gl.uniform1i(
      this.programs.gradienSubtractProgram.uniforms.uVelocity!,
      this._velocity.read.attach(1),
    );
    this.blit(this._velocity.write);
    this._velocity.swap();

    this.programs.advectionProgram.bind();
    this.gl.uniform2f(
      this.programs.advectionProgram.uniforms.texelSize!,
      this._velocity.texelSizeX,
      this._velocity.texelSizeY,
    );
    if (!this.ext.supportLinearFiltering)
      this.gl.uniform2f(
        this.programs.advectionProgram.uniforms.dyeTexelSize!,
        this._velocity.texelSizeX,
        this._velocity.texelSizeY,
      );
    const velocityId = this._velocity.read.attach(0);
    this.gl.uniform1i(
      this.programs.advectionProgram.uniforms.uVelocity!,
      velocityId,
    );
    this.gl.uniform1i(
      this.programs.advectionProgram.uniforms.uSource!,
      velocityId,
    );
    this.gl.uniform1f(this.programs.advectionProgram.uniforms.dt!, dt);
    this.gl.uniform1f(
      this.programs.advectionProgram.uniforms.dissipation!,
      this.velocityDissipation,
    );
    this.blit(this._velocity.write);
    this._velocity.swap();

    if (!this.ext.supportLinearFiltering)
      this.gl.uniform2f(
        this.programs.advectionProgram.uniforms.dyeTexelSize!,
        this._dye.texelSizeX,
        this._dye.texelSizeY,
      );
    this.gl.uniform1i(
      this.programs.advectionProgram.uniforms.uVelocity!,
      this._velocity.read.attach(0),
    );
    this.gl.uniform1i(
      this.programs.advectionProgram.uniforms.uSource!,
      this._dye.read.attach(1),
    );
    this.gl.uniform1f(
      this.programs.advectionProgram.uniforms.dissipation!,
      this.densityDissipation,
    );
    this.blit(this._dye.write);
    this._dye.swap();
  }

  private render(target: FBO | null) {
    if (this.bloom) this.applyBloom(this._dye.read, this._bloom);
    if (this.sunrays) {
      this.applySunrays(this._dye.read, this._dye.write, this._sunrays);
      this.blur(this._sunrays, this._sunraysTemp, 1);
    }

    if (target === null || !this.transparent) {
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.enable(this.gl.BLEND);
    } else {
      this.gl.disable(this.gl.BLEND);
    }

    if (!this.transparent)
      this.drawColor(
        target,
        Color.normalizeColor(Color.HEXtoRGB(this.backColor)),
      );
    this.drawDisplay(target);
  }

  private drawColor(target: FBO | null, color: RGBColor) {
    this.programs.colorProgram.bind();
    this.gl.uniform4f(
      this.programs.colorProgram.uniforms.color!,
      color.r,
      color.g,
      color.b,
      1,
    );
    this.blit(target);
  }

  private drawDisplay(target: FBO | null) {
    const width = target === null ? this.gl.drawingBufferWidth : target.width;
    const height =
      target === null ? this.gl.drawingBufferHeight : target.height;

    this.displayMaterial.bind();
    if (this.shading)
      this.gl.uniform2f(
        this.displayMaterial.uniforms.texelSize!,
        1.0 / width,
        1.0 / height,
      );
    this.gl.uniform1i(
      this.displayMaterial.uniforms.uTexture!,
      this._dye.read.attach(0),
    );
    if (this.bloom) {
      this.gl.uniform1i(
        this.displayMaterial.uniforms.uBloom!,
        this._bloom.attach(1),
      );
      this.gl.uniform1i(
        this.displayMaterial.uniforms.uDithering!,
        this.ditheringTexture.attach(2),
      );
      const scale = Texture.getTextureScale(
        this.ditheringTexture,
        width,
        height,
      );
      this.gl.uniform2f(
        this.displayMaterial.uniforms.ditherScale!,
        scale.x,
        scale.y,
      );
    }
    if (this.sunrays)
      this.gl.uniform1i(
        this.displayMaterial.uniforms.uSunrays!,
        this._sunrays.attach(3),
      );
    this.blit(target);
  }

  private applyBloom(source: FBO, destination: FBO) {
    if (this.bloomFramebuffers.length < 2) return;

    let last = destination;

    this.gl.disable(this.gl.BLEND);
    this.programs.bloomPrefilterProgram.bind();
    const knee = this.bloomThreshold * this.bloomSoftKnee + 0.0001;
    const curve0 = this.bloomThreshold - knee;
    const curve1 = knee * 2;
    const curve2 = 0.25 / knee;
    this.gl.uniform3f(
      this.programs.bloomPrefilterProgram.uniforms.curve!,
      curve0,
      curve1,
      curve2,
    );
    this.gl.uniform1f(
      this.programs.bloomPrefilterProgram.uniforms.threshold!,
      this.bloomThreshold,
    );
    this.gl.uniform1i(
      this.programs.bloomPrefilterProgram.uniforms.uTexture!,
      source.attach(0),
    );
    this.blit(last);

    this.programs.bloomBlurProgram.bind();
    for (const dest of this.bloomFramebuffers) {
      if (!dest) continue;
      this.gl.uniform2f(
        this.programs.bloomBlurProgram.uniforms.texelSize!,
        last.texelSizeX,
        last.texelSizeY,
      );
      this.gl.uniform1i(
        this.programs.bloomBlurProgram.uniforms.uTexture!,
        last.attach(0),
      );
      this.blit(dest);
      last = dest;
    }

    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
    this.gl.enable(this.gl.BLEND);

    for (let i = this.bloomFramebuffers.length - 2; i >= 0; i--) {
      const baseTex = this.bloomFramebuffers[i]!;
      this.gl.uniform2f(
        this.programs.bloomBlurProgram.uniforms.texelSize!,
        last.texelSizeX,
        last.texelSizeY,
      );
      this.gl.uniform1i(
        this.programs.bloomBlurProgram.uniforms.uTexture!,
        last.attach(0),
      );
      this.gl.viewport(0, 0, baseTex.width, baseTex.height);
      this.blit(baseTex);
      last = baseTex;
    }

    this.gl.disable(this.gl.BLEND);
    this.programs.bloomFinalProgram.bind();
    this.gl.uniform2f(
      this.programs.bloomFinalProgram.uniforms.texelSize!,
      last.texelSizeX,
      last.texelSizeY,
    );
    this.gl.uniform1i(
      this.programs.bloomFinalProgram.uniforms.uTexture!,
      last.attach(0),
    );

    this.gl.uniform1f(
      this.programs.bloomFinalProgram.uniforms.intensity!,
      this.bloomIntensity,
    );
    this.blit(destination);
  }

  private applySunrays(source: FBO, mask: FBO, destination: FBO) {
    this.gl.disable(this.gl.BLEND);
    this.programs.sunraysMaskProgram.bind();
    this.gl.uniform1i(
      this.programs.sunraysMaskProgram.uniforms.uTexture!,
      source.attach(0),
    );
    this.blit(mask);

    this.programs.sunraysProgram.bind();
    this.gl.uniform1f(
      this.programs.sunraysProgram.uniforms.weight!,
      this.sunraysWeight,
    );
    this.gl.uniform1i(
      this.programs.sunraysProgram.uniforms.uTexture!,
      mask.attach(0),
    );
    this.blit(destination);
  }

  private blur(target: FBO, temp: FBO, iterations: number) {
    this.programs.blurProgram.bind();
    for (let i = 0; i < iterations; i++) {
      this.gl.uniform2f(
        this.programs.blurProgram.uniforms.texelSize!,
        target.texelSizeX,
        0.0,
      );
      this.gl.uniform1i(
        this.programs.blurProgram.uniforms.uTexture!,
        target.attach(0),
      );
      this.blit(temp);

      this.gl.uniform2f(
        this.programs.blurProgram.uniforms.texelSize!,
        0.0,
        target.texelSizeY,
      );
      this.gl.uniform1i(
        this.programs.blurProgram.uniforms.uTexture!,
        temp.attach(0),
      );
      this.blit(target);
    }
  }

  public captureScreenshot() {
    const res = this.getResolution(this.captureResolution);
    const target = this.createFBO(
      res.width,
      res.height,
      this.ext.formatRGBA.internalFormat,
      this.ext.formatRGBA.format,
      this.ext.halfFloatTexType,
      this.gl.NEAREST,
    );
    this.render(target);

    const texture = Screenshot.framebufferToTexture(target, this.gl);
    const normalizedTexture = Screenshot.normalizeTexture(
      texture,
      target.width,
      target.height,
    );

    const captureCanvas = Screenshot.textureToCanvas(
      normalizedTexture,
      target.width,
      target.height,
    );
    const datauri = captureCanvas.toDataURL();
    Screenshot.downloadURI('fluid.png', datauri);
    URL.revokeObjectURL(datauri);
  }

  public get inverted(): boolean {
    return this._inverted;
  }
  public set inverted(value: boolean) {
    this._inverted = value;
    this.canvas.style.filter = value ? 'invert(1)' : 'none';
  }
}

export { Simulation };
