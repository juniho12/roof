'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  label: string
  currentUrl: string | null
  bucket: string
  onUploaded: (url: string) => void
}

export function ImageUploader({ label, currentUrl, bucket, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const filename = `${label.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.${file.name.split('.').pop()}`

    const { error } = await supabase.storage.from(bucket).upload(filename, file, {
      upsert: true,
    })

    if (error) {
      alert(`Erro ao fazer upload: ${error.message}`)
      setUploading(false)
      return
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`
    setPreview(url)
    onUploaded(url)
    setUploading(false)
  }

  return (
    <div className="mb-8">
      <p className="text-white font-bold mb-3">{label}</p>
      {preview && (
        <div className="mb-4 relative h-40 w-auto inline-block">
          <Image
            src={preview}
            alt={label}
            width={320}
            height={160}
            className="h-40 w-auto object-contain bg-black/30 border border-white/10"
          />
        </div>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? 'Enviando...' : `Carregar Nova ${label}`}
        </button>
      </div>
    </div>
  )
}
