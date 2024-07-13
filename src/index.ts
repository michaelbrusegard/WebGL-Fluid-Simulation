import { Color } from './color';
import { Simulation } from './simulation';

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
}

export default WebGLFluidEnhanced;
