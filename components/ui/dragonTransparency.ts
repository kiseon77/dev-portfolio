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
