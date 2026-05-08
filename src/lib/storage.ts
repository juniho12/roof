const CDN = process.env.NEXT_PUBLIC_STORAGE_CDN

export const storageUrl = (bucket: string, path: string) => {
  if (CDN) return `${CDN}/${bucket}/${path}`
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

export const rewriteToCdn = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (!CDN) return url
  const match = url.match(/\/storage\/v1\/object\/public\/(.+)$/)
  if (!match) return url
  return `${CDN}/${match[1]}`
}
