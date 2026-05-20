import React, { useState, useEffect, useCallback } from 'react'
import { supabase, CATEGORIES, STORAGE_BUCKET } from './lib/supabase'
import ItemCard from './components/ItemCard'
import ItemModal from './components/ItemModal'
import GirlModal from './components/GirlModal'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [girls, setGirls] = useState([])
  const [items, setItems] = useState([])
  const [curGirlId, setCurGirlId] = useState(null)
  const [tab, setTab] = useState('items')
  const [showItemModal, setShowItemModal] = useState(false)
  const [showGirlModal, setShowGirlModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [loadingGirls, setLoadingGirls] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)

  useEffect(() => { fetchGirls() }, [])

  useEffect(() => {
    if (curGirlId) fetchItems(curGirlId)
  }, [curGirlId])

  async function fetchGirls() {
    setLoadingGirls(true)
    const { data } = await supabase.from('girls').select('*').order('created_at')
    const list = data || []
    setGirls(list)
    if (list.length > 0) setCurGirlId(list[0].id)
    setLoadingGirls(false)
  }

  async function fetchItems(girlId) {
    setLoadingItems(true)
    const { data } = await supabase
      .from('items').select('*')
      .eq('girl_id', girlId)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoadingItems(false)
  }

  async function handleAddGirl(name, color) {
    const { data, error } = await supabase.from('girls').insert({ name, color }).select().single()
    if (!error) {
      setGirls(prev => [...prev, data])
      setCurGirlId(data.id)
    }
  }

  async function handleSaveItem({ name, price, category, emoji, photoFile }, editId) {
    let photo_url = editingItem?.photo_url || null

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = `${curGirlId}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET).upload(filename, photoFile, { upsert: true })
      if (!upErr) {
        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)
        photo_url = urlData.publicUrl
      }
    }

    if (editId) {
      const { data, error } = await supabase.from('items')
        .update({ name, price: parseFloat(price) || 0, category, emoji, photo_url })
        .eq('id', editId).select().single()
      if (!error) setItems(prev => prev.map(i => i.id === editId ? data : i))
    } else {
      const { data, error } = await supabase.from('items')
        .insert({
          name, price: parseFloat(price) || 0,
          original_price: parseFloat(price) || 0,
          category, emoji, photo_url,
          girl_id: curGirlId, sold: false,
        }).select().single()
      if (!error) setItems(prev => [data, ...prev])
    }
  }

  async function handleDeleteItem(id) {
    await supabase.from('items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function handleToggleSold(item) {
    const updates = {
      sold: !item.sold,
      sold_at: !item.sold ? new Date().toISOString() : null,
    }
    const { data, error } = await supabase.from('items')
      .update(updates).eq('id', item.id).select().single()
    if (!error) setItems(prev => prev.map(i => i.id === item.id ? data : i))
  }

  const curGirl = girls.find(g => g.id === curGirlId)
  const soldItems = items.filter(i => i.sold)
  const totalEarned = soldItems.reduce((a, i) => a + Number(i.price), 0)

  const itemsByCat = CATEGORIES.reduce((acc, cat) => {
    const list = items.filter(i => i.category === cat.value)
    if (list.length) acc[cat.value] = { label: cat.label, items: list }
    return acc
  }, {})

  if (loadingGirls) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#6B6B80', fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
      CARGANDO...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      {/* Header */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#C8FF00', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Closet.Sale
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.03em', color: '#F4F4FF', lineHeight: 1, marginTop: 4 }}>
              The Drop
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#6B6B80', marginTop: 3 }}>
              {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
          <div style={{
            width: 38, height: 38, border: '1px solid #FFFFFF22',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9090A8', fontSize: 20,
          }}>🛍️</div>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{ display: 'flex', margin: '16px 18px 0', border: '1px solid #FFFFFF22', borderRadius: 10, overflow: 'hidden' }}>
        {['items', 'dash'].map((t, i) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px 8px',
            fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
            textTransform: 'uppercase', border: 'none', cursor: 'pointer',
            background: tab === t ? '#C8FF00' : 'transparent',
            color: tab === t ? '#0A0A0F' : '#9090A8',
            transition: 'all 0.2s',
          }}>
            {['Inventario', 'Dashboard'][i]}
          </button>
        ))}
      </div>

      {tab === 'items' && (
        <>
          {/* Girl pills */}
          <div style={{ display: 'flex', gap: 8, padding: '14px 18px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {girls.map(g => (
              <button key={g.id} onClick={() => setCurGirlId(g.id)} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 6,
                fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                border: `1px solid ${curGirlId === g.id ? g.color : '#FFFFFF22'}`,
                background: curGirlId === g.id ? g.color + '18' : 'transparent',
                color: curGirlId === g.id ? g.color : '#9090A8',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.color, display: 'inline-block' }} />
                {g.name}
              </button>
            ))}
            <button onClick={() => setShowGirlModal(true)} style={{
              flexShrink: 0, padding: '7px 12px', borderRadius: 6,
              fontSize: 11, border: '1px dashed #FFFFFF22', background: 'transparent',
              color: '#6B6B80', cursor: 'pointer', letterSpacing: '0.06em',
            }}>+ Amiga</button>
          </div>

          {/* Mini stats */}
          {curGirl && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, padding: '14px 18px 0' }}>
              {[
                { label: 'Items', val: items.length, green: false },
                { label: 'Recaudado', val: `$${totalEarned.toFixed(0)}`, green: true },
              ].map(s => (
                <div key={s.label} style={{ background: '#1A1A24', border: '1px solid #FFFFFF14', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: s.green ? '#4FFFB0' : '#F4F4FF', letterSpacing: '-0.02em' }}>{s.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Items list */}
          <div style={{ padding: '16px 18px 0' }}>
            {loadingItems ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#6B6B80', fontFamily: "'Space Mono', monospace", fontSize: 11 }}>CARGANDO...</div>
            ) : Object.keys(itemsByCat).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B6B80' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🧥</div>
                <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {curGirl ? 'Sin items aún' : 'Selecciona una amiga'}
                </div>
              </div>
            ) : (
              Object.entries(itemsByCat).map(([cat, { label, items: catItems }]) => (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6B80', fontFamily: "'Space Mono', monospace" }}>{label}</div>
                    <div style={{ background: '#22222E', color: '#9090A8', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: "'Space Mono', monospace" }}>{catItems.length}</div>
                  </div>
                  {catItems.map(item => (
                    <ItemCard key={item.id} item={item}
                      onEdit={i => { setEditingItem(i); setShowItemModal(true) }}
                      onToggleSold={handleToggleSold} />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Add button */}
          {curGirl && (
            <button onClick={() => { setEditingItem(null); setShowItemModal(true) }} style={{
              margin: '8px 18px 32px', width: 'calc(100% - 36px)',
              padding: 14, border: '1px dashed #FFFFFF22', borderRadius: 12,
              background: 'transparent', color: '#6B6B80',
              fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}>
              + Agregar item
            </button>
          )}
        </>
      )}

      {tab === 'dash' && <Dashboard girls={girls} />}

      {showItemModal && (
        <ItemModal
          item={editingItem}
          girlId={curGirlId}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          onClose={() => { setShowItemModal(false); setEditingItem(null) }}
        />
      )}

      {showGirlModal && (
        <GirlModal
          onSave={handleAddGirl}
          onClose={() => setShowGirlModal(false)}
        />
      )}
    </div>
  )
}
