import ImageKit from "imagekit";

function getImageKit(): ImageKit | null {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return null;
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}

export async function uploadToImageKit(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "/weskateco"
): Promise<string> {
  const ik = getImageKit();
  if (!ik) {
    throw new Error(
      "ImageKit credentials (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT) are not set in environment."
    );
  }

  const res = await ik.upload({
    file: fileBuffer,
    fileName,
    folder,
  });

  return res.url;
}
