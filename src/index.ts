import { Color } from './color';
import { Simulation } from './simulation';
import type { Config } from './types';

class WebGLFluidEnhanced {
  private container: HTMLElement;
  private simulation: Simulation;
  constructor(container: HTMLElement = document.body) {
    this.container = container;
    this.container.style.outline = 'none';
    this.container.style.position = 'relative';
    this.container.style.display = 'flex';
    this.container.style.justifyContent = 'center';
    this.container.style.alignItems = 'center';

    this.simulation = new Simulation(container);
  }

  public start() {
    if (this.simulation.hasStarted) return;
    this.simulation.start();
  }

  public stop() {
    if (!this.simulation.hasStarted) return;
    this.simulation.stop();
  }

  public togglePause(drawWhilePaused = false): boolean {
    if (!this.simulation.hasStarted) return false;
    this.simulation.paused = !this.simulation.paused;
    if (this.simulation.paused) {
      this.simulation.drawWhilePaused = drawWhilePaused;
    }
    return this.simulation.paused;
  }

  public multipleSplats(amount: number) {
    if (!this.simulation.hasStarted) return;
    this.simulation.multipleSplats(amount);
  }

  public splatAtLocation(
    x: number,
    y: number,
    dx: number,
    dy: number,
    HEXColor?: string,
  ) {
    if (!this.simulation.hasStarted) return;

    const normalizedX = x / this.simulation.canvas.width;
    const normalizedY = 1.0 - y / this.simulation.canvas.clientHeight;

    let color = HEXColor ? Color.HEXtoRGB(HEXColor) : undefined;

    if (!color) {
      color = Color.generateColor(
        this.simulation.colorPalette,
        this.simulation.brightness,
      );
    }

    color.r *= 10.0;
    color.g *= 10.0;
    color.b *= 10.0;

    this.simulation.splat(normalizedX, normalizedY, dx, dy, color);
  }

  public downloadScreenshot() {
    if (!this.simulation.hasStarted) return;
    this.simulation.captureScreenshot();
  }

  public setConfig(config: Config) {
    if (config.simResolution !== undefined) {
      this.simulation.simResolution = config.simResolution;
    }
    if (config.dyeResolution !== undefined) {
      this.simulation.dyeResolution = config.dyeResolution;
    }
    if (config.captureResolution !== undefined) {
      this.simulation.captureResolution = config.captureResolution;
    }
    if (config.densityDissipation !== undefined) {
      this.simulation.densityDissipation = config.densityDissipation;
    }
    if (config.velocityDissipation !== undefined) {
      this.simulation.velocityDissipation = config.velocityDissipation;
    }
    if (config.pressure !== undefined) {
      this.simulation.pressure = config.pressure;
    }
    if (config.pressureIterations !== undefined) {
      this.simulation.pressureIterations = config.pressureIterations;
    }
    if (config.curl !== undefined) {
      this.simulation.curl = config.curl;
    }
    if (config.splatRadius !== undefined) {
      this.simulation.splatRadius = config.splatRadius;
    }
    if (config.splatForce !== undefined) {
      this.simulation.splatForce = config.splatForce;
    }
    if (config.shading !== undefined) {
      this.simulation.shading = config.shading;
    }
    if (config.colorful !== undefined) {
      this.simulation.colorful = config.colorful;
    }
    if (config.colorUpdateSpeed !== undefined) {
      this.simulation.colorUpdateSpeed = config.colorUpdateSpeed;
    }
    if (config.colorPalette !== undefined) {
      this.simulation.colorPalette = config.colorPalette;
    }
    if (config.hover !== undefined) {
      this.simulation.hover = config.hover;
    }
    if (config.backgroundColor !== undefined) {
      this.simulation.backgroundColor = config.backgroundColor;
    }
    if (config.inverted !== undefined) {
      this.simulation.inverted = config.inverted;
    }
    if (config.transparent !== undefined) {
      this.simulation.transparent = config.transparent;
    }
    if (config.brightness !== undefined) {
      this.simulation.brightness = config.brightness;
    }
    if (config.bloom !== undefined) {
      this.simulation.bloom = config.bloom;
    }
    if (config.bloomIterations !== undefined) {
      this.simulation.bloomIterations = config.bloomIterations;
    }
    if (config.bloomResolution !== undefined) {
      this.simulation.bloomResolution = config.bloomResolution;
    }
    if (config.bloomIntensity !== undefined) {
      this.simulation.bloomIntensity = config.bloomIntensity;
    }
    if (config.bloomThreshold !== undefined) {
      this.simulation.bloomThreshold = config.bloomThreshold;
    }
    if (config.bloomSoftKnee !== undefined) {
      this.simulation.bloomSoftKnee = config.bloomSoftKnee;
    }
    if (config.sunrays !== undefined) {
      this.simulation.sunrays = config.sunrays;
    }
    if (config.sunraysResolution !== undefined) {
      this.simulation.sunraysResolution = config.sunraysResolution;
    }
    if (config.sunraysWeight !== undefined) {
      this.simulation.sunraysWeight = config.sunraysWeight;
    }

    if (!this.simulation.hasStarted) return;

    if (
      config.dyeResolution !== undefined ||
      config.simResolution !== undefined
    ) {
      this.simulation.initFramebuffers();
    }

    if (
      config.shading !== undefined ||
      config.bloom !== undefined ||
      config.sunrays !== undefined
    ) {
      this.simulation.updateKeywords();
    }
  }
}

export * from './config';
export default WebGLFluidEnhanced;
