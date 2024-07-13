import { Program } from './program';
import type { Shaders } from './shaders';

class Programs {
  public blurProgram: Program;
  public copyProgram: Program;
  public clearProgram: Program;
  public colorProgram: Program;
  public checkerboardProgram: Program;
  public bloomPrefilterProgram: Program;
  public bloomBlurProgram: Program;
  public bloomFinalProgram: Program;
  public sunraysMaskProgram: Program;
  public sunraysProgram: Program;
  public splatProgram: Program;
  public advectionProgram: Program;
  public divergenceProgram: Program;
  public curlProgram: Program;
  public vorticityProgram: Program;
  public pressureProgram: Program;
  public gradienSubtractProgram: Program;

  constructor(gl: WebGL2RenderingContext, shaders: Shaders) {
    this.blurProgram = new Program(
      shaders.blurVertexShader,
      shaders.blurShader,
      gl,
    );

    this.copyProgram = new Program(
      shaders.baseVertexShader,
      shaders.copyShader,
      gl,
    );

    this.clearProgram = new Program(
      shaders.baseVertexShader,
      shaders.clearShader,
      gl,
    );

    this.colorProgram = new Program(
      shaders.baseVertexShader,
      shaders.colorShader,
      gl,
    );

    this.checkerboardProgram = new Program(
      shaders.baseVertexShader,
      shaders.checkerboardShader,
      gl,
    );

    this.bloomPrefilterProgram = new Program(
      shaders.baseVertexShader,
      shaders.bloomPrefilterShader,
      gl,
    );

    this.bloomBlurProgram = new Program(
      shaders.baseVertexShader,
      shaders.bloomBlurShader,
      gl,
    );

    this.bloomFinalProgram = new Program(
      shaders.baseVertexShader,
      shaders.bloomFinalShader,
      gl,
    );
    this.sunraysMaskProgram = new Program(
      shaders.baseVertexShader,
      shaders.sunraysMaskShader,
      gl,
    );

    this.sunraysProgram = new Program(
      shaders.baseVertexShader,
      shaders.sunraysShader,
      gl,
    );

    this.splatProgram = new Program(
      shaders.baseVertexShader,
      shaders.splatShader,
      gl,
    );

    this.advectionProgram = new Program(
      shaders.baseVertexShader,
      shaders.advectionShader,
      gl,
    );

    this.divergenceProgram = new Program(
      shaders.baseVertexShader,
      shaders.divergenceShader,
      gl,
    );

    this.curlProgram = new Program(
      shaders.baseVertexShader,
      shaders.curlShader,
      gl,
    );

    this.vorticityProgram = new Program(
      shaders.baseVertexShader,
      shaders.vorticityShader,
      gl,
    );

    this.pressureProgram = new Program(
      shaders.baseVertexShader,
      shaders.pressureShader,
      gl,
    );

    this.gradienSubtractProgram = new Program(
      shaders.baseVertexShader,
      shaders.gradientSubtractShader,
      gl,
    );
  }
}

export { Programs };
