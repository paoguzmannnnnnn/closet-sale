import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const STORAGE_BUCKET = 'item-photos'

export const CATEGORIES = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'zapatos', label: 'Zapatos' },
  { value: 'bags', label: 'Bags' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'outerwear', label: 'Outerwear' },
]

export const GIRL_ACCENTS = [
  '#C8FF00', '#4FFFB0', '#FF6B9D', '#A78BFA', '#FFB347', '#00CFFF'
]
