// Resize and compress selected cover images in the browser before uploading.
export async function optimizeCover(dataUrl: string, name: string) {
  const image = new Image();
  image.src = dataUrl;
  await image.decode().catch(() => { throw new Error("이미지를 읽지 못했습니다."); });
  if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 60000000)
    throw new Error("이미지 크기가 너무 큽니다. 작은 파일을 선택해 주세요.");
  // Keep animation intact instead of silently flattening an animated GIF.
  if (dataUrl.startsWith("data:image/gif;")) {
    const bytes = Math.floor((dataUrl.split(",")[1]?.length || 0) * 3 / 4);
    if (bytes > 8 * 1024 * 1024) throw new Error("GIF는 8MB 이하 파일을 선택해 주세요.");
    return { name, dataUrl, bytes, width: image.naturalWidth, height: image.naturalHeight };
  }
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  let width = Math.max(1, Math.round(image.naturalWidth * scale));
  let height = Math.max(1, Math.round(image.naturalHeight * scale));
  let quality = 0.82, blob: Blob | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이미지 압축을 지원하지 않는 브라우저입니다.");
    context.drawImage(image, 0, 0, width, height);
    blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob) throw new Error("이미지를 압축하지 못했습니다.");
    if (blob.size <= 400 * 1024) break;
    if (quality > 0.7) quality = 0.7;
    else if (attempt < 7) { width = Math.max(1, Math.round(width * 0.85)); height = Math.max(1, Math.round(height * 0.85)); }
  }
  if (!blob || blob.size > 8 * 1024 * 1024) throw new Error("이미지 용량을 줄이지 못했습니다. 다른 사진을 선택해 주세요.");
  const compressed = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("압축 이미지를 읽지 못했습니다.")); reader.readAsDataURL(blob);
  });
  return { dataUrl: compressed, name: `${name.replace(/\.[^.]+$/, "")}.${blob.type === "image/webp" ? "webp" : "png"}`, bytes: blob.size, width, height };
}
