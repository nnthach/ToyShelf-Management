import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function uploadFileModelSupabase(file: File): Promise<string> {
  console.log("file", file);
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("models")
    .upload(fileName, file, {
      contentType: "model/gltf-binary",
    });

  if (error) {
    console.error("Upload error:", error);
    return "";
  }

  const { data: publicUrlData } = supabase.storage
    .from("models")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
