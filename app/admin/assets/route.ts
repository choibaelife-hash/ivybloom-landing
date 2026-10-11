import {
  guard,
  adminClient,
  failure,
  AdminError,
} from "@/lib/admin/sanity-server";
export async function POST(request: Request) {
  try {
    await guard(request, true);
    const length = Number(request.headers.get("content-length"));
    if (length > 9 * 1024 * 1024)
      throw new AdminError("8MB 이하 이미지를 선택하세요.");
    const file = (await request.formData()).get("file");
    if (
      !(file instanceof File) ||
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      ) ||
      !file.size ||
      file.size > 8 * 1024 * 1024
    )
      throw new AdminError("JPG·PNG·WebP·GIF, 8MB 이하 파일을 선택하세요.");
    const asset = await adminClient().assets.upload(
      "image",
      Buffer.from(await file.arrayBuffer()),
      { filename: file.name, contentType: file.type },
    );
    return Response.json({
      asset: {
        _id: asset._id,
        url: asset.url,
        originalFilename: asset.originalFilename,
      },
    });
  } catch (error) {
    return failure(error);
  }
}
