import { Shader } from './shader';

class Program {
  public gl: WebGL2RenderingContext;
  public program: WebGLProgram;
  public uniforms: Record<string, WebGLUniformLocation>;
  constructor(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    gl: WebGL2RenderingContext,
  ) {
    this.gl = gl;
    this.uniforms = {};
    this.program = Shader.createProgram(vertexShader, fragmentShader, gl);
    this.uniforms = Shader.getUniforms(this.program, gl);
  }

  public bind() {
    this.gl.useProgram(this.program);
  }
}

export { Program };
