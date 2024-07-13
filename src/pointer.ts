import { Color } from './color';

class Pointer {
  public id = -1;
  public texcoordX = 0;
  public texcoordY = 0;
  public prevTexcoordX = 0;
  public prevTexcoordY = 0;
  public deltaX = 0;
  public deltaY = 0;
  public down = false;
  public moved = false;
  public color;

  constructor(colorPalette: string[], brightness: number) {
    this.color = Color.generateColor(colorPalette, brightness);
  }

  public updatePointerDownData(
    id: number,
    posX: number,
    posY: number,
    canvas: HTMLCanvasElement,
    colorPalette: string[],
    brightness: number,
  ) {
    this.id = id;
    this.down = true;
    this.moved = false;
    this.texcoordX = posX / canvas.width;
    this.texcoordY = 1.0 - posY / canvas.height;
    this.prevTexcoordX = this.texcoordX;
    this.prevTexcoordY = this.texcoordY;
    this.deltaX = 0;
    this.deltaY = 0;
    this.color = Color.generateColor(colorPalette, brightness);
  }

  public updatePointerMoveData(
    posX: number,
    posY: number,
    canvas: HTMLCanvasElement,
    hover: boolean,
  ) {
    this.prevTexcoordX = this.texcoordX;
    this.prevTexcoordY = this.texcoordY;
    this.texcoordX = posX / canvas.width;
    this.texcoordY = 1.0 - posY / canvas.height;
    this.deltaX = this.correctDeltaX(
      this.texcoordX - this.prevTexcoordX,
      canvas,
    );
    this.deltaY = this.correctDeltaY(
      this.texcoordY - this.prevTexcoordY,
      canvas,
    );
    if (hover) {
      this.moved = Math.abs(this.deltaX) > 0 || Math.abs(this.deltaY) > 0;
    } else {
      this.moved = this.down;
    }
  }

  public updatePointerUpData() {
    this.down = false;
  }

  private correctDeltaX(delta: number, canvas: HTMLCanvasElement): number {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }

  private correctDeltaY(delta: number, canvas: HTMLCanvasElement): number {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }
}

export { Pointer };
