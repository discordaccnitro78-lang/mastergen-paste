import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface Paste {
  id: string
  title: string | null
  content: string
  language: string | null
  created_at: string
  expires_at: string | null
  is_private: boolean
  view_count: number
}

export const usePastes = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createPaste = async (pasteData: {
    title?: string
    content: string
    language?: string
    expires_at?: string
    is_private?: boolean
    password?: string
  }) => {
    setIsLoading(true)
    try {
      // Generate a unique ID for the paste
      const pasteId = Math.random().toString(36).substring(2, 15)
      
      const { data, error } = await supabase
        .from('pastes')
        .insert([
          {
            id: pasteId,
            title: pasteData.title || null,
            content: pasteData.content,
            language: pasteData.language || 'text',
            expires_at: pasteData.expires_at || null,
            is_private: pasteData.is_private || false,
            password: pasteData.password || null,
            view_count: 0
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Paste créé avec succès!",
        description: `Votre paste est disponible avec l'ID: ${pasteId}`,
      })

      return { data, pasteId }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le paste",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getPaste = async (id: string, password?: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('pastes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!data) {
        throw new Error('Paste not found')
      }

      // Check if paste requires password
      if (data.password && data.password !== password) {
        throw new Error('Password required')
      }

      // Increment view count
      await supabase
        .from('pastes')
        .update({ view_count: data.view_count + 1 })
        .eq('id', id)

      return data
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Paste introuvable",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getRecentPastes = async () => {
    try {
      const { data, error } = await supabase
        .from('pastes')
        .select('id, title, language, created_at, view_count')
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recent pastes:', error)
      return []
    }
  }

  return {
    createPaste,
    getPaste,
    getRecentPastes,
    isLoading
  }
}