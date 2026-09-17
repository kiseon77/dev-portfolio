"use client";

import { useEffect, useRef, useState } from "react";
import { bind, layerFor, Rig, type Binding } from "./dragonRig";

interface Mesh {
  name?: string;
  bindings: Binding[];
  vertices: Float32Array;
  indices: Uint16Array;
  vbo?: WebGLBuffer;
  ibo?: WebGLBuffer;
}

const EYES = [
  {
    x: 396,
    y: 691,
    rx: 35,
    ry: 38,
    sx: 373,
    sy: 668,
    sw: 57,
    sh: 68,
    w: 56,
    h: 66,
  },
  {
    x: 568,
    y: 763,
    rx: 29,
    ry: 29,
    sx: 540,
    sy: 739,
    sw: 43,
    sh: 52,
    w: 43,
    h: 51,
  },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed: " + src));
    img.src = src;
  });
}

function geometry(
  x: number,
  y: number,
  w: number,
  h: number,
  cols: number,
  rows: number,
  uv = [0, 0, 1, 1],
) {
  const vertices = new Float32Array((cols + 1) * (rows + 1) * 7);
  const bindings: Binding[] = [];
  const indices: number[] = [];
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const nx = i / cols;
      const ny = j / rows;
      const k = bindings.length * 7;
      const px = x + nx * w;
      const py = y + ny * h;
      vertices[k + 3] = uv[0] + nx * uv[2];
      vertices[k + 4] = uv[1] + ny * uv[3];
      vertices[k + 5] = px;
      vertices[k + 6] = py;
      bindings.push(bind(px, py));
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * (cols + 1) + i;
      indices.push(k, k + 1, k + cols + 1, k + 1, k + cols + 2, k + cols + 1);
    }
  }
  return { vertices, bindings, indices: new Uint16Array(indices) };
}

export default function Dragon2_5D() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingText, setLoadingText] = useState("용이 깨어나는 중…");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;

    const rig = new Rig();
    const target = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;
    let width = 0;
    let height = 0;
    let scale = 1;
    let disposed = false;

    function point(e: PointerEvent) {
      target.x = Math.max(
        -1,
        Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2),
      );
      target.y = Math.max(
        -1,
        Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2),
      );
    }
    const reset = () => {
      target.x = target.y = 0;
    };
    window.addEventListener("pointermove", point, { passive: true });
    window.addEventListener("pointerdown", point, { passive: true });
    window.addEventListener("pointercancel", reset);
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") reset();
    };
    window.addEventListener("pointerup", onPointerUp);

    function poseMesh(mesh: Mesh) {
      const out: [number, number, number] = [0, 0, 0];
      for (let i = 0; i < mesh.bindings.length; i++) {
        rig.deform(mesh.bindings[i], out);
        mesh.vertices[i * 7] = out[0];
        mesh.vertices[i * 7 + 1] = out[1];
        mesh.vertices[i * 7 + 2] = out[2];
      }
    }

    let cleanupGl: (() => void) | undefined;

    Promise.all([
      loadImage("/dragon/dragon.png"),
      loadImage("/dragon/original.png"),
    ])
      .then(([dragon, original]) => {
        if (disposed) return;
        const gl = canvas.getContext("webgl", {
          alpha: true,
          antialias: true,
          premultipliedAlpha: false,
        });
        if (!gl) {
          setLoadingText("이 브라우저에서는 WebGL을 사용할 수 없어요.");
          return;
        }

        const vs =
          "attribute vec3 a_pos;attribute vec2 a_uv;attribute vec2 a_rest;uniform vec2 u_view;uniform float u_scale;varying vec2 v_uv;varying vec2 v_rest;void main(){v_uv=a_uv;v_rest=a_rest;vec2 p=(a_pos.xy-vec2(512.,768.))*u_scale+u_view*vec2(.5,.49);gl_Position=vec4(p.x/u_view.x*2.-1.,1.-p.y/u_view.y*2.,0.,1.);}";
        const fs =
          "precision mediump float;uniform sampler2D u_image;uniform float u_eye;uniform vec2 u_eyeCenter;uniform vec2 u_eyeRadius;uniform vec4 u_crop;varying vec2 v_uv;varying vec2 v_rest;void main(){vec4 c=texture2D(u_image,v_uv);if(u_eye>.5){vec2 q=(v_uv-u_crop.xy)/u_crop.zw;float disk=length(q*2.-1.);float clipEye=length((v_rest-u_eyeCenter)/u_eyeRadius);c.a*=1.-smoothstep(.84,1.,disk);c.a*=1.-smoothstep(.88,1.,clipEye);}gl_FragColor=c;}";

        function shader(type: number, source: string) {
          const s = gl!.createShader(type)!;
          gl!.shaderSource(s, source);
          gl!.compileShader(s);
          if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS))
            throw new Error(gl!.getShaderInfoLog(s) ?? "shader compile failed");
          return s;
        }
        const program = gl.createProgram()!;
        gl.attachShader(program, shader(gl.VERTEX_SHADER, vs));
        gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw new Error(
            gl.getProgramInfoLog(program) ?? "program link failed",
          );
        gl.useProgram(program);

        const u: Record<string, WebGLUniformLocation | null> = {};
        for (const n of [
          "view",
          "scale",
          "image",
          "eye",
          "eyeCenter",
          "eyeRadius",
          "crop",
        ]) {
          u[n] = gl.getUniformLocation(program, "u_" + n);
        }
        const attrib: [number, number, number][] = [
          ["a_pos", 3, 0],
          ["a_uv", 2, 12],
          ["a_rest", 2, 20],
        ].map(([n, s, o]) => [
          gl.getAttribLocation(program, n as string),
          s as number,
          o as number,
        ]);

        function texture(im: HTMLImageElement) {
          const t = gl!.createTexture()!;
          gl!.bindTexture(gl!.TEXTURE_2D, t);
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
          gl!.texParameteri(
            gl!.TEXTURE_2D,
            gl!.TEXTURE_WRAP_S,
            gl!.CLAMP_TO_EDGE,
          );
          gl!.texParameteri(
            gl!.TEXTURE_2D,
            gl!.TEXTURE_WRAP_T,
            gl!.CLAMP_TO_EDGE,
          );
          gl!.texImage2D(
            gl!.TEXTURE_2D,
            0,
            gl!.RGBA,
            gl!.RGBA,
            gl!.UNSIGNED_BYTE,
            im,
          );
          return t;
        }
        const bodyTexture = texture(dragon);
        const eyeTexture = texture(original);

        function prepare(mesh: Mesh) {
          mesh.vbo = gl!.createBuffer()!;
          mesh.ibo = gl!.createBuffer()!;
          gl!.bindBuffer(gl!.ARRAY_BUFFER, mesh.vbo);
          gl!.bufferData(gl!.ARRAY_BUFFER, mesh.vertices, gl!.DYNAMIC_DRAW);
          gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, mesh.ibo);
          gl!.bufferData(
            gl!.ELEMENT_ARRAY_BUFFER,
            mesh.indices,
            gl!.STATIC_DRAW,
          );
          return mesh;
        }

        // Separate indexed surfaces share boundary vertices and the same original
        // UVs. Joint weights stay continuous at every cut: no painted seams or holes.
        const surface = geometry(0, 0, 1024, 1536, 100, 150);
        const parts = new Map<string, number[]>();
        for (let i = 0; i < surface.indices.length; i += 3) {
          const tri = Array.from(surface.indices.slice(i, i + 3));
          const x = tri.reduce((v, k) => v + surface.bindings[k].x, 0) / 3;
          const y = tri.reduce((v, k) => v + surface.bindings[k].y, 0) / 3;
          const name = layerFor(bind(x, y));
          if (!parts.has(name)) parts.set(name, []);
          parts.get(name)!.push(...tri);
        }
        const bodyParts: Mesh[] = Array.from(parts, ([name, idx]) => {
          const remap = new Map<number, number>();
          const bindings: Binding[] = [];
          const vertices: number[] = [];
          const compact: number[] = [];
          for (const k of idx) {
            if (!remap.has(k)) {
              remap.set(k, bindings.length);
              bindings.push(surface.bindings[k]);
              vertices.push(...surface.vertices.slice(k * 7, k * 7 + 7));
            }
            compact.push(remap.get(k)!);
          }
          return prepare({
            name,
            bindings,
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(compact),
          });
        });
        const eyeMeshes = EYES.map((e) =>
          prepare(
            geometry(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6, 8, [
              e.sx / 1024,
              e.sy / 1536,
              e.sw / 1024,
              e.sh / 1536,
            ]),
          ),
        );

        function draw(mesh: Mesh, tex: WebGLTexture) {
          poseMesh(mesh);
          gl!.bindTexture(gl!.TEXTURE_2D, tex);
          gl!.bindBuffer(gl!.ARRAY_BUFFER, mesh.vbo!);
          gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, mesh.vertices);
          for (const [a, s, o] of attrib) {
            gl!.enableVertexAttribArray(a);
            gl!.vertexAttribPointer(a, s, gl!.FLOAT, false, 28, o);
          }
          gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, mesh.ibo!);
          gl!.drawElements(
            gl!.TRIANGLES,
            mesh.indices.length,
            gl!.UNSIGNED_SHORT,
            0,
          );
        }
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);

        function resize() {
          if (!scene || !canvas) return;
          const r = scene.getBoundingClientRect();
          width = r.width;
          height = r.height;
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
          scale = Math.min((width * 1.0) / 1024, (height * 1.0) / 1536);
          gl!.viewport(0, 0, canvas.width, canvas.height);
          gl!.uniform2f(u.view, width, height);
          gl!.uniform1f(u.scale, scale);
        }
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(scene);
        resize();
        setLoaded(true);

        function renderFrame() {
          gl!.clear(gl!.COLOR_BUFFER_BIT);
          gl!.uniform1f(u.eye, 0);
          for (const part of bodyParts) draw(part, bodyTexture);
          gl!.uniform1f(u.eye, 1);
          EYES.forEach((e, j) => {
            const mesh = eyeMeshes[j];
            for (let i = 0; i < mesh.bindings.length; i++) {
              const k = i * 7;
              const x = e.x - e.w / 2 + ((i % 7) / 6) * e.w + rig.look.x * 9;
              const y =
                e.y - e.h / 2 + (Math.floor(i / 7) / 8) * e.h + rig.look.y * 7;
              mesh.bindings[i] = bind(x, y);
              mesh.vertices[k + 5] = x;
              mesh.vertices[k + 6] = y;
            }
            gl!.uniform2f(u.eyeCenter, e.x, e.y);
            gl!.uniform2f(u.eyeRadius, e.rx, e.ry);
            gl!.uniform4f(
              u.crop,
              e.sx / 1024,
              e.sy / 1536,
              e.sw / 1024,
              e.sh / 1536,
            );
            draw(mesh, eyeTexture);
          });
        }

        function tick(now: number) {
          const dt = Math.min((now - last) / 1000 || 0, 1 / 30);
          last = now;
          rig.step(dt, target, true);
          renderFrame();
          if (!document.hidden) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);

        function onVisibilityChange() {
          cancelAnimationFrame(frame);
          if (!document.hidden) {
            last = performance.now();
            frame = requestAnimationFrame(tick);
          }
        }
        document.addEventListener("visibilitychange", onVisibilityChange);

        function onContextLost(e: Event) {
          e.preventDefault();
          cancelAnimationFrame(frame);
          setLoadingText("화면을 새로고침하면 용이 다시 깨어나요.");
          setLoaded(false);
        }
        canvas.addEventListener("webglcontextlost", onContextLost);

        cleanupGl = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          document.removeEventListener("visibilitychange", onVisibilityChange);
          canvas.removeEventListener("webglcontextlost", onContextLost);
        };
      })
      .catch((error) => {
        console.error(error);
        setLoadingText("그림을 불러오지 못했어요. 페이지를 새로고침해주세요.");
      });

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", point);
      window.removeEventListener("pointerdown", point);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("pointerup", onPointerUp);
      cleanupGl?.();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto h-full max-h-full w-auto max-w-full aspect-[2/3.3] touch-pan-y"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
      {!loaded && (
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-[#806749]">
          {loadingText}
        </p>
      )}
    </div>
  );
}
