import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET;

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
