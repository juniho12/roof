export type HeroSection = {
  id: string
  background_image_url: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export type HeroButton = {
  id: string
  hero_id: string | null
  name: string
  image_url: string | null
  link_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type HeroLink = {
  id: string
  hero_id: string | null
  name: string
  text: string
  link_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type SliderImage = {
  id: string
  image_url: string
  alt_text: string | null
  display_order: number
  is_active: boolean
  link_url: string | null
  created_at: string
  updated_at: string
}

export type VideoCarouselItem = {
  id: string
  title: string | null
  video_url: string
  thumbnail_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FooterLink = {
  id: string
  name: string
  icon_name: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FooterSettings = {
  id: string
  phone: string | null
  email: string | null
  cnpj: string | null
  created_at: string
  updated_at: string
}

export type AboutImage = {
  id: string
  image_url: string
  alt_text: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ContentSectionSettings = {
  id: string
  title: string
  subtitle: string | null
  created_at: string
  updated_at: string
}

export type UserRole = {
  id: string
  user_id: string
  role: 'admin' | 'user'
  created_at: string
}

export type Profile = {
  id: string
  user_id: string
  display_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
