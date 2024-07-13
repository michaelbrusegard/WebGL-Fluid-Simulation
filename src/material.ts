import { Shader } from './shader';

class Material {
  public gl: WebGL2RenderingContext;
  public vertexShader: WebGLShader;
  public fragmentShaderSource: string;
  public programs: WebGLProgram[];
  public activeProgram: WebGLProgram | null;
  public uniforms: Record<string, WebGLUniformLocation>;
  constructor(
    vertexShader: WebGLShader,
    fragmentShaderSource: string,
    gl: WebGL2RenderingContext,
  ) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShaderSource = fragmentShaderSource;
    this.programs = [];
    this.activeProgram = null;
    this.uniforms = {};
  }

  public setKeywords(keywords: string[]) {
    let hash = 0;
    for (const keyword of keywords) {
      hash += this.hashCode(keyword);
    }

    let program = this.programs[hash];
    if (program == null) {
      const fragmentShader = Shader.compileShader(
        this.gl,
        this.gl.FRAGMENT_SHADER,
        this.fragmentShaderSource,
        keywords,
      )!;
      program = Shader.createProgram(
        this.vertexShader,
        fragmentShader,
        this.gl,
      );
      this.programs[hash] = program;
    }

    if (program == this.activeProgram) return;

    this.uniforms = Shader.getUniforms(program, this.gl);
    this.activeProgram = program;
  }

  private hashCode(s: string): number {
    if (s.length === 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  public bind() {
    this.gl.useProgram(this.activeProgram);
  }
}

export { Material };
