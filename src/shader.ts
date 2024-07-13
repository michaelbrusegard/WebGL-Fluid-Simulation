class Shader {
  public static getUniforms(
    program: WebGLProgram,
    gl: WebGL2RenderingContext,
  ): Record<string, WebGLUniformLocation> {
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const uniformCount = gl.getProgramParameter(
      program,
      gl.ACTIVE_UNIFORMS,
    ) as number;
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i)!.name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName)!;
    }
    return uniforms;
  }

  public static createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    gl: WebGL2RenderingContext,
  ): WebGLProgram {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.trace(gl.getProgramInfoLog(program));

    return program;
  }

  public static compileShader(
    gl: WebGL2RenderingContext,
    type: GLenum,
    source: string,
    keywords?: string[] | null,
  ): WebGLShader | null {
    source = Shader.addKeywords(source, keywords);

    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.trace(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  private static addKeywords(
    source: string,
    keywords?: string[] | null,
  ): string {
    if (keywords == null) return source;
    let keywordsString = '';
    keywords.forEach((keyword) => {
      keywordsString += '#define ' + keyword + '\n';
    });
    return keywordsString + source;
  }
}

export { Shader };
