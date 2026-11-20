import React, { useEffect, useRef } from "react";

interface LiquidMetalCanvasProps {
  isHovered: boolean;
  isPressed: boolean;
}

export const LiquidMetalCanvas: React.FC<LiquidMetalCanvasProps> = ({ isHovered, isPressed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const speedRef = useRef(0.6);
  const targetSpeedRef = useRef(0.6);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    glRef.current = gl;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_speed;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.45;
        float n1 = snoise(st * 3.5 + vec2(t * 0.3, t * 0.2));
        float n2 = snoise(st * 7.0 - vec2(t * 0.4, n1 * 0.5));
        float n3 = snoise(st * 12.0 + vec2(n2 * 0.6, t * 0.5));

        float fluid = sin(n1 * 4.0 + n2 * 3.0 + n3 * 2.0);
        float metallic = pow(abs(fluid), 0.35);
        float rim = pow(1.0 - abs(fluid), 3.0);
        
        vec3 chromeBase = vec3(0.12, 0.12, 0.13) + metallic * vec3(0.85, 0.85, 0.9);
        vec3 crimsonTouch = vec3(0.71, 0.17, 0.10) * rim * 1.2;
        vec3 finalColor = chromeBase + crimsonTouch;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type)!;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    programRef.current = program;

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    function render() {
      if (!gl || !canvas || !programRef.current) return;
      const time = (Date.now() - startTimeRef.current) * 0.001;
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.1;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(programRef.current);

      const uRes = gl.getUniformLocation(programRef.current, "u_resolution");
      const uTime = gl.getUniformLocation(programRef.current, "u_time");
      const uSpeed = gl.getUniformLocation(programRef.current, "u_speed");

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uSpeed, speedRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPressed) {
      targetSpeedRef.current = 2.4;
    } else if (isHovered) {
      targetSpeedRef.current = 1.2;
    } else {
      targetSpeedRef.current = 0.6;
    }
  }, [isHovered, isPressed]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={54}
      className="w-full h-full block rounded-full"
      style={{ width: "100%", height: "100%", borderRadius: "70px" }}
    />
  );
};
