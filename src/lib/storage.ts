// Never use supabase.storage.getPublicUrl() — triggers /object/info/ metadata calls
// DB URLs are already full URLs — use them directly
// This helper is only for when we have a path after upload
export const storageUrl = (bucket: string, path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
