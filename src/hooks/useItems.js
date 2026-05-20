import { useState, useEffect } from 'react'
import { supabase, STORAGE_BUCKET } from '../lib/supabase'

export function useItems(girlId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (girlId) fetchItems()
  }, [girlId])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('girl_id', girlId)
      .order('created_at', { ascending: false })
    if (!error) setItems(data || [])
    setLoading(false)
  }

  async function fetchAllItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  }

  async function addItem({ name, price, category, emoji, girlId: gid, photoFile }) {
    let photo_url = null

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, photoFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filename)
        photo_url = urlData.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('items')
      .insert({
        name,
        price: parseFloat(price) || 0,
        original_price: parseFloat(price) || 0,
        category,
        emoji,
        girl_id: gid || girlId,
        photo_url,
      })
      .select()
      .single()

    if (!error) setItems(prev => [data, ...prev])
    return { data, error }
  }

  async function updateItem(id, updates, photoFile) {
    let photo_url = updates.photo_url

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, photoFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filename)
        photo_url = urlData.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('items')
      .update({ ...updates, photo_url })
      .eq('id', id)
      .select()
      .single()

    if (!error) setItems(prev => prev.map(i => (i.id === id ? data : i)))
    return { data, error }
  }

  async function toggleSold(id, currentSold) {
    const updates = {
      sold: !currentSold,
      sold_at: !currentSold ? new Date().toISOString() : null,
    }
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setItems(prev => prev.map(i => (i.id === id ? data : i)))
    return { data, error }
  }

  async function deleteItem(id) {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (!error) setItems(prev => prev.filter(i => i.id !== id))
    return { error }
  }

  const soldItems = items.filter(i => i.sold)
  const totalEarned = soldItems.reduce((a, i) => a + Number(i.price), 0)
  const totalPotential = items.reduce((a, i) => a + Number(i.price), 0)

  return {
    items,
    loading,
    soldItems,
    totalEarned,
    totalPotential,
    fetchItems,
    fetchAllItems,
    addItem,
    updateItem,
    toggleSold,
    deleteItem,
  }
}
