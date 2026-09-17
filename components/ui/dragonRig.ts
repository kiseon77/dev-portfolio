// Anatomical 2.5D rig; texture coordinates never change with the pose.
// Ported from a standalone WebGL prototype (rig.js) — vertices are deformed
// per-frame from bone weights computed on the rest-pose UV coordinates.
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
type Mat = [number, number, number, number, number, number];
const identity = (): Mat => [1, 0, 0, 1, 0, 0];
function multiply(a: Mat, b: Mat): Mat {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}
function rotate(x: number, y: number, a: number): Mat {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c, s, -s, c, x - c * x + s * y, y - s * x - c * y];
}
const tailPath: [number, number][] = [
  [803, 622],
  [650, 434],
  [642, 340],
  [840, 282],
  [859, 219],
  [701, 156],
  [573, 99],
  [671, 52],
];
function ellipse(x: number, y: number, cx: number, cy: number, rx: number, ry: number) {
  return Math.hypot((x - cx) / rx, (y - cy) / ry);
}

export interface Binding {
  x: number;
  y: number;
  tail: number;
  ti: number;
  tt: number;
  left: number;
  near: number;
  far: number;
  upper: number;
  head: number;
  wl: number;
  wr: number;
  mane: number[];
}

export function bind(x: number, y: number): Binding {
  let tail = smooth(435, 575, x) * (1 - smooth(480, 675, y));
  // Monotonic binding along the curled tail avoids ambiguous nearest-bone
  // jumps where adjacent curls and tufts overlap in the illustration.
  let ti = 0;
  while (ti < tailPath.length - 2 && y < tailPath[ti + 1][1]) ti++;
  const tt = clamp((tailPath[ti][1] - y) / (tailPath[ti][1] - tailPath[ti + 1][1]));
  // The high rear foot must not inherit the tail's wave.
  const upper = smooth(760, 830, x) * smooth(440, 490, y) * (1 - smooth(575, 640, y));
  tail *= 1 - upper;
  const left = (1 - smooth(1, 1.5, ellipse(x, y, 214, 951, 124, 112))) * smooth(829, 925, y) * (1 - smooth(295, 384, x));
  const near = smooth(610, 705, x) * smooth(1025, 1160, y) * (1 - smooth(1360, 1430, y));
  const far = (1 - smooth(1, 1.45, ellipse(x, y, 603, 1199, 65, 80))) * smooth(1090, 1155, y) * (1 - smooth(639, 680, x));
  let head = 1 - smooth(0.72, 1.3, ellipse(x, y, 466, 713, 270, 245));
  const horns = (1 - smooth(0.8, 1.25, ellipse(x, y, 395, 481, 90, 165))) * (1 - smooth(565, 640, y));
  head = Math.max(head, horns);
  head *= 1 - tail;
  const wl = (1 - smooth(150, 330, x)) * smooth(370, 450, y) * (1 - smooth(680, 825, y));
  const wr = smooth(866, 980, x) * smooth(712, 788, y) * (1 - smooth(991, 1060, y));
  // Hair locks have fixed roots and increasingly compliant tips.
  const maneLocks: [number, number, number, number, number, number][] = [
    [305, 650, 220, 516, 78, 128],
    [326, 747, 226, 728, 88, 100],
    [354, 830, 275, 879, 88, 78],
    [563, 639, 573, 528, 80, 117],
    [622, 741, 704, 661, 103, 85],
    [634, 833, 741, 849, 110, 78],
  ];
  const mane = maneLocks.map(([ax, ay, tx, ty, rx, ry]) => {
    const dx = tx - ax;
    const dy = ty - ay;
    const l2 = dx * dx + dy * dy;
    const along = clamp(((x - ax) * dx + (y - ay) * dy) / l2);
    const zone = 1 - smooth(0.48, 1.12, ellipse(x, y, tx, ty, rx, ry));
    return zone * along * along;
  });
  return { x, y, tail, ti, tt, left, near, far, upper, head, wl, wr, mane };
}

interface SpringState {
  x: number;
  v: number;
}

export interface Pose {
  t: number;
  p: number;
  bank: number;
  tail: Mat[];
  left: Mat;
  near: Mat;
  far: Mat;
  upper: Mat;
  leftWrist: Mat;
  nearAnkle: Mat;
  yaw: number;
  pitch: number;
  roll: number;
  wl: number;
  wr: number;
  mane: number[];
  lift: number;
  travel: number;
  depth: number;
}

export class Rig {
  time = 0;
  look = { x: 0, y: 0, vx: 0, vy: 0 };
  wL: SpringState = { x: 0, v: 0 };
  wR: SpringState = { x: 0, v: 0 };
  sway: SpringState = { x: 0, v: 0 };
  locks: SpringState[] = Array.from({ length: 6 }, () => ({ x: 0, v: 0 }));
  pose: Pose;

  constructor() {
    this.pose = this.makePose();
  }

  private spring(state: SpringState, target: number, dt: number, k = 22, d = 7) {
    const acceleration = (target - state.x) * k - state.v * d;
    state.v += acceleration * dt;
    state.x += state.v * dt;
  }

  step(dt: number, target: { x: number; y: number }, moving = true): Pose {
    dt = clamp(dt, 0, 1 / 30);
    const k = 1 - Math.exp(-dt * 5.5);
    const px = this.look.x;
    const py = this.look.y;
    this.look.x += (target.x - this.look.x) * k;
    this.look.y += (target.y - this.look.y) * k;
    this.look.vx = dt ? (this.look.x - px) / dt : 0;
    this.look.vy = dt ? (this.look.y - py) / dt : 0;
    if (moving) {
      this.time += dt;
      const p = this.time * 1.28;
      this.spring(this.wL, Math.sin(p - 1.1) * 0.7 - this.look.vx * 0.32, dt);
      this.spring(this.wR, Math.sin(p - 1.65) * 0.62 - this.look.vx * 0.25, dt);
      this.spring(this.sway, target.x * 0.65, dt, 9, 5.8);
      for (let i = 0; i < this.locks.length; i++) {
        this.spring(
          this.locks[i],
          Math.sin(this.time * 1.28 - i * 0.46) * 0.6 - this.look.vx * 0.18 + this.sway.v * 0.12,
          dt,
          13 - i * 0.7,
          5.4
        );
      }
    }
    this.pose = this.makePose();
    return this.pose;
  }

  private makePose(): Pose {
    const t = this.time;
    const p = t * 1.28;
    const bank = Math.sin(p) * 0.016 + this.sway.x * 0.032;
    const tail: Mat[] = [];
    let parent = identity();
    for (let i = 0; i < tailPath.length; i++) {
      const amount = i === 0 ? 0.006 : 0.019 + i * 0.004;
      const a = Math.sin(p - i * 0.62) * amount + Math.sin(p * 0.53 - i * 0.36) * amount * 0.25 - this.look.x * 0.004;
      parent = multiply(parent, rotate(tailPath[i][0], tailPath[i][1], a));
      tail.push(parent);
    }
    const left = rotate(308, 882, Math.sin(p + 0.9) * 0.11 - bank * 1.4 - this.sway.v * 0.028);
    const near = rotate(660, 1058, Math.sin(p + 3.45) * 0.085 + bank * 1.2 + this.sway.v * 0.024);
    const far = rotate(637, 1093, Math.sin(p + 1.7) * 0.075 - bank * 0.9);
    const upper = rotate(789, 441, Math.sin(p + 3.1) * 0.095 + bank * 1.1);
    return {
      t,
      p,
      bank,
      tail,
      left,
      near,
      far,
      upper,
      leftWrist: multiply(left, rotate(202, 941, Math.sin(p + 0.35) * 0.08)),
      nearAnkle: multiply(near, rotate(747, 1238, Math.sin(p + 2.8) * 0.07)),
      yaw: this.look.x * 0.1 + Math.sin(p * 0.68) * 0.022,
      pitch: this.look.y * 0.07 + Math.sin(p * 0.93 + 0.7) * 0.019,
      roll: Math.sin(p * 0.76 - 0.4) * 0.021 - this.look.x * 0.016,
      wl: this.wL.x,
      wr: this.wR.x,
      mane: this.locks.map((a) => a.x),
      lift: Math.sin(p) * 13 + Math.sin(p * 0.5) * 3,
      travel: Math.sin(p * 0.5) * 11,
      depth: Math.sin(p * 0.64 - 0.7) * 0.006,
    };
  }

  deform(b: Binding, out: [number, number, number] = [0, 0, 0]): [number, number, number] {
    const q = this.pose;
    const x = b.x;
    const y = b.y;
    let px = x;
    let py = y;
    let z = 0;
    function add(m: Mat, w: number) {
      if (w < 0.00001) return;
      px += (m[0] * x + m[2] * y + m[4] - x) * w;
      py += (m[1] * x + m[3] * y + m[5] - y) * w;
    }
    const i = b.ti;
    add(q.tail[i], b.tail * (1 - b.tt));
    add(q.tail[Math.min(i + 1, 7)], b.tail * b.tt);
    const wrist = smooth(260, 170, x);
    add(q.left, b.left * (1 - wrist));
    add(q.leftWrist, b.left * wrist);
    const ankle = smooth(1200, 1280, y);
    add(q.near, b.near * (1 - ankle));
    add(q.nearAnkle, b.near * ankle);
    add(q.far, b.far);
    add(q.upper, b.upper);
    // A shallow curved head surface, not a flat 2D scale: yaw/pitch alter
    // depth and perspective continuously, with the nose closer than ears.
    if (b.head > 0.00001) {
      const hx = x - 465;
      const hy = y - 738;
      const r2 = (hx / 260) ** 2 + (hy / 275) ** 2;
      const hz = 112 * Math.sqrt(Math.max(0, 1 - r2));
      const cy = Math.cos(q.yaw);
      const sy = Math.sin(q.yaw);
      const cp = Math.cos(q.pitch);
      const sp = Math.sin(q.pitch);
      const cr = Math.cos(q.roll);
      const sr = Math.sin(q.roll);
      const rx = hx * cy + hz * sy;
      const rz = -hx * sy + hz * cy;
      const ry = hy * cp - rz * sp;
      const depth = hy * sp + rz * cp;
      // Divide by the rest-pose perspective so zero rotation is identical.
      const perspective = (1050 - hz) / (1050 - depth);
      const fx = (rx * cr - ry * sr) * perspective;
      const fy = (rx * sr + ry * cr) * perspective;
      px += (fx - hx) * b.head;
      py += (fy - hy) * b.head;
      z += depth * b.head;
    }
    // Local mane offsets are applied AFTER the head pose, so each lock
    // follows the face while its tip lags behind. Eyes/nose are outside masks.
    for (let i = 0; i < b.mane.length; i++) {
      const w = b.mane[i];
      const side = i < 3 ? -1 : 1;
      px += side * w * (q.mane[i] * 7 + Math.sin(q.p * 1.45 - i * 0.6) * 1.5);
      py += w * (q.mane[i] * 10 + Math.sin(q.p * 1.7 - i * 0.7) * 2);
    }
    // Free whisker tips respond after the head; their roots stay attached.
    px += b.wl * (q.wl * 9 + Math.sin(q.p * 1.8 + y * 0.014) * 4 * b.wl);
    py += b.wl * (q.wl * 18 + Math.sin(q.p * 2.1 + x * 0.019) * 7 * b.wl);
    px += b.wr * (q.wr * 11 + Math.sin(q.p * 1.7 + y * 0.012) * 4 * b.wr);
    py += b.wr * (q.wr * 23 + Math.sin(q.p * 2 + x * 0.018 + 1.3) * 10 * b.wr);
    // The torso is a stable mass. Global motion is rigid banking/lift.
    const a = q.bank;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const dx = px - 535;
    const dy = py - 800;
    const zoom = 1 + q.depth;
    out[0] = 535 + (dx * c - dy * s) * zoom + q.travel;
    out[1] = 800 + (dx * s + dy * c) * zoom + q.lift;
    out[2] = z;
    return out;
  }
}

export function layerFor(b: Binding) {
  if (b.wl > 0.35) return "whisker-left";
  if (b.wr > 0.35) return "whisker-right";
  if (b.left > 0.35) return "arm-front";
  if (b.near > 0.35) return "leg-front";
  if (b.far > 0.35) return "leg-back";
  if (b.upper > 0.35) return "arm-back";
  if (b.tail > 0.35) return "tail";
  if (b.head > 0.35) return "head";
  return "torso";
}
