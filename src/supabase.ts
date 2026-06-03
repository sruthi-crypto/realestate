import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET?.trim();

function getSupabaseStorageConfig() {
  if (!supabaseUrl || !supabaseAnonKey || !supabaseBucket) {
    throw new Error("Supabase storage environment variables are missing");
  }

  return {
    bucket: supabaseBucket,
    client: createClient(supabaseUrl, supabaseAnonKey),
  };
}

export type UploadedMedia = {
  url: string;
  originalName: string;
  resourceType: string;
};

export function resolveSupabasePublicUrl(url: string) {
  if (!url || !supabaseUrl || !supabaseBucket) return url;

  try {
    const parsedUrl = new URL(url);
    const configuredProject = new URL(supabaseUrl);
    const publicPrefix = "/storage/v1/object/public/";
    const prefixIndex = parsedUrl.pathname.indexOf(publicPrefix);

    if (prefixIndex === -1 || !parsedUrl.hostname.endsWith(".supabase.co")) {
      return url;
    }

    const publicPath = parsedUrl.pathname.slice(prefixIndex + publicPrefix.length);
    const firstSlashIndex = publicPath.indexOf("/");

    if (firstSlashIndex === -1) return url;

    const objectPath = publicPath.slice(firstSlashIndex + 1);
    parsedUrl.protocol = configuredProject.protocol;
    parsedUrl.host = configuredProject.host;
    parsedUrl.pathname = `${publicPrefix}${supabaseBucket}/${objectPath}`;

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

function getSupabaseObjectPath(url: string) {
  if (!url || !supabaseBucket) return null;

  try {
    const parsedUrl = new URL(url);
    const storagePrefixes = [
      "/storage/v1/object/public/",
      "/storage/v1/object/",
    ];
    const matchedPrefix = storagePrefixes.find((prefix) =>
      parsedUrl.pathname.includes(prefix)
    );

    if (!matchedPrefix || !parsedUrl.hostname.endsWith(".supabase.co")) {
      return null;
    }

    const publicPath = parsedUrl.pathname.slice(
      parsedUrl.pathname.indexOf(matchedPrefix) + matchedPrefix.length
    );
    const firstSlashIndex = publicPath.indexOf("/");

    if (firstSlashIndex === -1) return null;

    return decodeURIComponent(publicPath.slice(firstSlashIndex + 1));
  } catch {
    return null;
  }
}

export async function deleteFilesFromSupabase(urls: string[]) {
  const { client, bucket } = getSupabaseStorageConfig();
  const filePaths = Array.from(
    new Set(urls.map(getSupabaseObjectPath).filter((path): path is string => Boolean(path)))
  );

  if (filePaths.length === 0) return;

  const { error } = await client.storage.from(bucket).remove(filePaths);

  if (error) {
    throw new Error(error.message);
  }
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function uploadFilesToSupabase(files: File[]): Promise<UploadedMedia[]> {
  const { client, bucket } = getSupabaseStorageConfig();
  const uploads = await Promise.all(
    files.map(async (file) => {
      const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
      const safeName = sanitizeFileName(file.name);
      const folder = file.type.startsWith("video/") ? "videos" : "images";
      const filePath = `${folder}/${crypto.randomUUID()}-${safeName}${extension && !safeName.endsWith(`.${extension}`) ? `.${extension}` : ""}`;

      const { error } = await client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = client.storage.from(bucket).getPublicUrl(filePath);

      return {
        url: data.publicUrl,
        originalName: file.name,
        resourceType: file.type.startsWith("video/") ? "video" : "image",
      };
    })
  );

  return uploads;
}
