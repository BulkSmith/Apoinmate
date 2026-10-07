import { supabase } from "@/integrations/supabase/client";

/** Turns a stored avatar path into a temporary viewable URL. */
export async function signedAvatarUrl(path: string | null | undefined) {
  if (!path) return null;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export async function uploadAvatar(userId: string, file: File) {
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${userId}/${crypto.randomUUID()}-${safe}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type || "image/jpeg" });
  if (error) throw error;
  return path;
}
