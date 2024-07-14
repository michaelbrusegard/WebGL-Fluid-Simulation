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

  public pause(drawWhilePaused = false) {
    this.simulation.paused = !this.simulation.paused;
    this.simulation.drawWhilePaused = drawWhilePaused;
  }

  public multipleSplats(amount: number) {
    this.simulation.multipleSplats(amount);
  }

  public splatAtLocation(
    x: number,
    y: number,
    dx: number,
    dy: number,
    HEXColor?: string,
  ) {
    let color = HEXColor ? Color.HEXtoRGB(HEXColor) : undefined;

    if (color) {
      color.r *= 0.15;
      color.g *= 0.15;
      color.b *= 0.15;
    } else {
      color = Color.generateColor(
        this.simulation.colorPalette,
        this.simulation.brightness,
      );
    }

    this.simulation.splat(x, y, dx, dy, color);
  }

  public downloadScreenshot() {
    this.simulation.captureScreenshot();
  }

  public setConfig(config: Config) {
    if (config.simResolution) {
      this.simulation.simResolution = config.simResolution;
    }
    if (config.dyeResolution) {
      this.simulation.dyeResolution = config.dyeResolution;
    }
    if (config.captureResolution) {
      this.simulation.captureResolution = config.captureResolution;
    }
    if (config.densityDissipation) {
      this.simulation.densityDissipation = config.densityDissipation;
    }
    if (config.velocityDissipation) {
      this.simulation.velocityDissipation = config.velocityDissipation;
    }
    if (config.pressure) {
      this.simulation.pressure = config.pressure;
    }
    if (config.pressureIterations) {
      this.simulation.pressureIterations = config.pressureIterations;
    }
    if (config.curl) {
      this.simulation.curl = config.curl;
    }
    if (config.splatRadius) {
      this.simulation.splatRadius = config.splatRadius;
    }
    if (config.splatForce) {
      this.simulation.splatForce = config.splatForce;
    }
    if (config.shading) {
      this.simulation.shading = config.shading;
    }
    if (config.colorful) {
      this.simulation.colorful = config.colorful;
    }
    if (config.colorUpdateSpeed) {
      this.simulation.colorUpdateSpeed = config.colorUpdateSpeed;
    }
    if (config.colorPalette) {
      this.simulation.colorPalette = config.colorPalette;
    }
    if (config.hover) {
      this.simulation.hover = config.hover;
    }
    if (config.backColor) {
      this.simulation.backColor = config.backColor;
    }
    if (config.inverted) {
      this.simulation.inverted = config.inverted;
    }
    if (config.transparent) {
      this.simulation.transparent = config.transparent;
    }
    if (config.brightness) {
      this.simulation.brightness = config.brightness;
    }
    if (config.bloom) {
      this.simulation.bloom = config.bloom;
    }
    if (config.bloomIterations) {
      this.simulation.bloomIterations = config.bloomIterations;
    }
    if (config.bloomResolution) {
      this.simulation.bloomResolution = config.bloomResolution;
    }
    if (config.bloomIntensity) {
      this.simulation.bloomIntensity = config.bloomIntensity;
    }
    if (config.bloomThreshold) {
      this.simulation.bloomThreshold = config.bloomThreshold;
    }
    if (config.bloomSoftKnee) {
      this.simulation.bloomSoftKnee = config.bloomSoftKnee;
    }
    if (config.sunrays) {
      this.simulation.sunrays = config.sunrays;
    }
    if (config.sunraysResolution) {
      this.simulation.sunraysResolution = config.sunraysResolution;
    }
    if (config.sunraysWeight) {
      this.simulation.sunraysWeight = config.sunraysWeight;
    }

    if (config.dyeResolution ?? config.simResolution) {
      this.simulation.initFramebuffers();
    }

    if (config.shading ?? config.bloom ?? config.sunrays) {
      this.simulation.updateKeywords();
    }
  }
}

export default WebGLFluidEnhanced;
