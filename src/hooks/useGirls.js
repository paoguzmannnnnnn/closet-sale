import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGirls() {
  const [girls, setGirls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGirls()
  }, [])

  async function fetchGirls() {
    setLoading(true)
    const { data, error } = await supabase
      .from('girls')
      .select('*')
      .order('created_at')
    if (!error) setGirls(data || [])
    setLoading(false)
  }

  async function addGirl(name, color) {
    const { data, error } = await supabase
      .from('girls')
      .insert({ name, color })
      .select()
      .single()
    if (!error) setGirls(prev => [...prev, data])
    return { data, error }
  }

  async function deleteGirl(id) {
    const { error } = await supabase.from('girls').delete().eq('id', id)
    if (!error) setGirls(prev => prev.filter(g => g.id !== id))
    return { error }
  }

  return { girls, loading, fetchGirls, addGirl, deleteGirl }
}
