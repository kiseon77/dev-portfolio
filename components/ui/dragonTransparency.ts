/** Remove the connected paper backdrop once, before a frame enters the cache. */
export async function transparentDragon(image: HTMLImageElement): Promise<ImageBitmap> {
  const w = image.naturalWidth, h = image.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, w, h);
  const data = pixels.data;
  const count = w * h;
  const eligible = new Uint8Array(count);
  const background = new Uint8Array(count);
  const queue = new Int32Array(count);
  let head = 0, tail = 0;

  // The paper is low-chroma beige, including its neutral cast shadow. Red
  // scales, dark outlines and golden horns form barriers to the border flood.
  for (let i = 0; i < count; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    eligible[i] = +(r > 95 && g > 90 && b > 75 && r - g < 29 && g - b < 35 && r - b < 57);
  }
  function seed(i: number) {
    if (eligible[i] && !background[i]) { background[i] = 1; queue[tail++] = i; }
  }
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
  while (head < tail) {
    const i = queue[head++], x = i % w;
    if (x > 0) seed(i - 1);
    if (x < w - 1) seed(i + 1);
    if (i >= w) seed(i - w);
    if (i < count - w) seed(i + w);
  }
  // Paper enclosed by the subject (inside the whisker loop, between tail and
  // body) is not reachable from the border. Remove an enclosed region only when
  // its average colour matches the border paper; cream fur differs by 11+ levels
  // across all 121 frames, the trapped paper by 9 or less.
  let pr = 0, pg = 0, pb = 0;
  for (let k = 0; k < tail; k++) {
    const i = queue[k];
    pr += data[i * 4]; pg += data[i * 4 + 1]; pb += data[i * 4 + 2];
  }
  if (tail) { pr /= tail; pg /= tail; pb /= tail; }
  const seen = new Uint8Array(count);
  const region = new Int32Array(count);
  for (let s = 0; s < count; s++) {
    if (!eligible[s] || background[s] || seen[s]) continue;
    let rh = 0, rt = 0, sr = 0, sg = 0, sb = 0;
    seen[s] = 1; region[rt++] = s;
    while (rh < rt) {
      const i = region[rh++], x = i % w;
      sr += data[i * 4]; sg += data[i * 4 + 1]; sb += data[i * 4 + 2];
      const next = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i >= w ? i - w : -1, i < count - w ? i + w : -1];
      for (const j of next) {
        if (j >= 0 && eligible[j] && !background[j] && !seen[j]) { seen[j] = 1; region[rt++] = j; }
      }
    }
    const diff = Math.max(Math.abs(sr / rt - pr), Math.abs(sg / rt - pg), Math.abs(sb / rt - pb));
    if (rt >= 150 && diff <= 9) for (let k = 0; k < rt; k++) background[region[k]] = 1;
  }

  for (let i = 0; i < count; i++) {
    if (background[i]) { data[i * 4 + 3] = 0; continue; }
    // A narrow antialiased edge avoids a hard cut without blurring the subject.
    const x = i % w;
    const n = (x > 0 ? background[i - 1] : 0) + (x < w - 1 ? background[i + 1] : 0)
      + (i >= w ? background[i - w] : 0) + (i < count - w ? background[i + w] : 0);
    if (n) data[i * 4 + 3] = Math.round(255 * (1 - n * 0.13));
  }
  ctx.putImageData(pixels, 0, 0);
  return createImageBitmap(canvas);
}
