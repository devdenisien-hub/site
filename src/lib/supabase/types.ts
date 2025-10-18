// Types TypeScript pour Supabase
// Ces types seront générés automatiquement depuis votre base de données

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Interface de base pour les tables
export interface Database {
  public: {
    Tables: {
      // Exemple de table - à adapter selon votre base de données
      // randonnees: {
      //   Row: {
      //     id: number
      //     titre: string
      //     description: string | null
      //     difficulte: 'facile' | 'moyen' | 'difficile'
      //     date: string
      //     lieu: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: number
      //     titre: string
      //     description?: string | null
      //     difficulte: 'facile' | 'moyen' | 'difficile'
      //     date: string
      //     lieu: string
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: number
      //     titre?: string
      //     description?: string | null
      //     difficulte?: 'facile' | 'moyen' | 'difficile'
      //     date?: string
      //     lieu?: string
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type helper pour extraire les types de table
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Pour générer automatiquement les types depuis votre base de données, utilisez:
// npx supabase gen types typescript --project-id wokpbajmuatqykbcsjmv > src/lib/supabase/types.ts



