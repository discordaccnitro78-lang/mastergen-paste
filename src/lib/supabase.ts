import { createClient } from '@supabase/supabase-js'

// ✅ Chargement des variables d’environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ Affichage en console pour debug (temporaire, à supprimer après)
console.log("🔗 VITE_SUPABASE_URL:", supabaseUrl)
console.log("🔐 VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? '✅ Provided' : '❌ Missing')

// ✅ Vérification de la présence des variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("❌ Les variables d'environnement Supabase sont manquantes.")
  throw new Error('Missing Supabase environment variables (check your .env file)')
}

// ✅ Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ Typage (optionnel mais utile)
export type Database = {
  public: {
    Tables: {
      pastes: {
        Row: {
          id: string
          title: string | null
          content: string
          language: string | null
          created_at: string
          expires_at: string | null
          is_private: boolean
          password: string | null
          view_count: number
        }
        Insert: {
          id?: string
          title?: string | null
          content: string
          language?: string | null
          created_at?: string
          expires_at?: string | null
          is_private?: boolean
          password?: string | null
          view_count?: number
        }
        Update: {
          id?: string
          title?: string | null
          content?: string
          language?: string | null
          created_at?: string
          expires_at?: string | null
          is_private?: boolean
          password?: string | null
          view_count?: number
        }
      }
    }
  }
}
