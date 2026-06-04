import React, { useState, useEffect } from 'react'
import { supabase, STORAGE_BUCKET } from './lib/supabase'
import ItemCard from './components/ItemCard'
import ItemModal from './components/ItemModal'
import GirlModal from './components/GirlModal'
import Dashboard from './pages/Dashboard'

const CATEGORIES = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'zapatos', label: 'Zapatos' },
  { value: 'bags', label: 'Bags' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'outerwear', label: 'Outerwear' },
]

const GIRL_ACCENTS = ['#C8FF00','#4FFFB0','#FF6B9D','#A78BFA','#FFB347','#00CFFF']

function GirlModal2({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(GIRL_ACCENTS[0])
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    await onSave(name.trim(), color)
    setSaving(false)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.88)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#1A1A24', border: '1px solid #FFFFFF22', borderRadius: 16, padding: 24, width: '100%' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#F4F4FF', marginBottom: 20 }}>Agregar amiga</div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>Nombre</div>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          placeholder="Ej: Sofía"
          style={{ width: '100%', padding: '10px 13px', border: '1px solid #FFFFFF22', borderRadius: 8, background: '#22222E', color: '#F4F4FF', fontSize: 13, outline: 'none', marginBottom: 16 }} />
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>Color</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {GIRL_ACCENTS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{
              width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
              border: c === color ? '3px solid #F4F4FF' : '3px solid transparent', transition: 'border-color 0.15s',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '11px 16px', border: '1px solid #FFFFFF22', borderRadius: 8, background: 'transparent', color: '#9090A8', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: 11, borderRadius: 8, border: 'none', background: '#C8FF00', color: '#0A0A0F', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {saving ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Collapsible category section
function CategorySection({ label, items, girls, onEdit, onToggleSold, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const soldCount = items.filter(i => i.sold).length

  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', background: '#1A1A24', border: '1px solid #FFFFFF14',
        borderRadius: open ? '10px 10px 0 0' : 10, cursor: 'pointer', transition: 'border-radius 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9090A8', fontFamily: "'Space Mono', monospace" }}>{label}</span>
          <span style={{ background: '#22222E', color: '#9090A8', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: "'Space Mono', monospace" }}>{items.length}</span>
          {soldCount > 0 && (
            <span style={{ background: '#4FFFB015', color: '#4FFFB0', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: "'Space Mono', monospace" }}>{soldCount} sold</span>
          )}
        </div>
        <span style={{ color: '#6B6B80', fontSize: 16, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span>
      </button>
      {open && (
        <div style={{ border: '1px solid #FFFFFF14', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '10px 10px 4px' }}>
          {items.map(item => (
            <ItemCard key={item.id} item={item} girls={girls}
              onEdit={onEdit} onToggleSold={onToggleSold} />
          ))}
        </div>
      )}
    </div>
  )
}

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
  const [search, setSearch] = useState('')

  useEffect(() => { fetchGirls() }, [])
  useEffect(() => { if (curGirlId) fetchItems(curGirlId) }, [curGirlId])

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
    const { data } = await supabase.from('items').select('*')
      .eq('girl_id', girlId).order('created_at', { ascending: false })
    setItems(data || [])
    setLoadingItems(false)
  }

  async function handleAddGirl(name, color) {
    const { data, error } = await supabase.from('girls').insert({ name, color }).select().single()
    if (!error) { setGirls(prev => [...prev, data]); setCurGirlId(data.id) }
  }

  async function handleSaveItem({ name, price, category, emoji, photoFile }, editId) {
    let photo_url = editingItem?.photo_url || null
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = `${curGirlId}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET).upload(filename, photoFile, { upsert: true })
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
      const { data, error } = await supabase.from('items').insert({
        name, price: parseFloat(price) || 0, original_price: parseFloat(price) || 0,
        category, emoji, photo_url, girl_id: curGirlId, sold: false,
      }).select().single()
      if (!error) setItems(prev => [data, ...prev])
    }
  }

  async function handleDeleteItem(id) {
    await supabase.from('items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function handleToggleSold(item, paymentMethod, toGirlId) {
    const updates = {
      sold: !item.sold,
      sold_at: !item.sold ? new Date().toISOString() : null,
      payment_method: !item.sold ? paymentMethod : null,
      paid_to_girl_id: !item.sold ? toGirlId : null,
    }
    const { data, error } = await supabase.from('items').update(updates).eq('id', item.id).select().single()
    if (!error) setItems(prev => prev.map(i => i.id === item.id ? data : i))
  }

  const curGirl = girls.find(g => g.id === curGirlId)
  const filteredItems = search.trim()
    ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : items
  const soldItems = items.filter(i => i.sold)
  const totalEarned = soldItems.reduce((a, i) => a + Number(i.price), 0)

  const availableItems = filteredItems.filter(i => !i.sold)
  const soldItems2 = filteredItems.filter(i => i.sold)

  const itemsByCat = CATEGORIES.reduce((acc, cat) => {
    const list = availableItems.filter(i => i.category === cat.value)
    if (list.length) acc[cat.value] = { label: cat.label, items: list }
    return acc
  }, {})

  if (loadingGirls) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#6B6B80', fontFamily: "'Space Mono', monospace", fontSize: 11 }}>CARGANDO...</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      {/* Header */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#C8FF00', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Closet.Sale</div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.03em', color: '#F4F4FF', lineHeight: 1, marginTop: 4 }}>The Drop</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#6B6B80', marginTop: 3 }}>
              {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
          <div style={{ width: 38, height: 38, border: '1px solid #FFFFFF22', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛍️</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', margin: '16px 18px 0', border: '1px solid #FFFFFF22', borderRadius: 10, overflow: 'hidden' }}>
        {['items', 'dash'].map((t, i) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px 8px', fontSize: 11, fontWeight: t === tab ? 600 : 500,
            letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
            background: tab === t ? '#C8FF00' : 'transparent',
            color: tab === t ? '#0A0A0F' : '#9090A8', transition: 'all 0.2s',
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
              <button key={g.id} onClick={() => { setCurGirlId(g.id); setSearch('') }} style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                border: `1px solid ${curGirlId === g.id ? g.color : '#FFFFFF22'}`,
                background: curGirlId === g.id ? g.color + '18' : 'transparent',
                color: curGirlId === g.id ? g.color : '#9090A8', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.color }} />
                {g.name}
              </button>
            ))}
            <button onClick={() => setShowGirlModal(true)} style={{
              flexShrink: 0, padding: '7px 12px', borderRadius: 6, fontSize: 11,
              border: '1px dashed #FFFFFF22', background: 'transparent', color: '#6B6B80', cursor: 'pointer',
            }}>+ Amiga</button>
          </div>

          {/* Search bar */}
          {curGirl && (
            <div style={{ padding: '12px 18px 0' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#6B6B80' }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar prenda..."
                  style={{
                    width: '100%', padding: '10px 13px 10px 36px',
                    border: '1px solid #FFFFFF22', borderRadius: 8,
                    background: '#1A1A24', color: '#F4F4FF', fontSize: 13, outline: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', color: '#6B6B80', cursor: 'pointer', fontSize: 16,
                  }}>×</button>
                )}
              </div>
            </div>
          )}

          {/* Mini stats */}
          {curGirl && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, padding: '12px 18px 0' }}>
              {[
                { label: 'Items', val: items.length },
                { label: 'Recaudado', val: `$${totalEarned.toFixed(0)}`, green: true },
              ].map(s => (
                <div key={s.label} style={{ background: '#1A1A24', border: '1px solid #FFFFFF14', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: s.green ? '#4FFFB0' : '#F4F4FF' }}>{s.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Items by collapsible category */}
          <div style={{ padding: '14px 18px 0' }}>
            {loadingItems ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#6B6B80', fontFamily: "'Space Mono', monospace", fontSize: 11 }}>CARGANDO...</div>
            ) : Object.keys(itemsByCat).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B6B80' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🧥</div>
                <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {search ? 'Sin resultados' : curGirl ? 'Sin items aún' : 'Selecciona una amiga'}
                </div>
              </div>
            ) : (
              Object.entries(itemsByCat).map(([cat, { label, items: catItems }], idx) => (
                <CategorySection key={cat} label={label} items={catItems}
                  girls={girls} onEdit={i => { setEditingItem(i); setShowItemModal(true) }}
                  onToggleSold={handleToggleSold} defaultOpen={idx === 0} />
              ))
            )}
          </div>

          {soldItems2.length > 0 && (
            <CategorySection
              label="Vendidos"
              items={soldItems2}
              girls={girls}
              onEdit={i => { setEditingItem(i); setShowItemModal(true) }}
              onToggleSold={handleToggleSold}
              defaultOpen={false}
            />
          )}

          {curGirl && (
            <button onClick={() => { setEditingItem(null); setShowItemModal(true) }} style={{
              margin: '12px 18px 32px', width: 'calc(100% - 36px)', padding: 14,
              border: '1px dashed #FFFFFF22', borderRadius: 12, background: 'transparent',
              color: '#6B6B80', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              + Agregar item
            </button>
          )}
        </>
      )}

      {tab === 'dash' && <Dashboard girls={girls} />}

      {showItemModal && (
        <ItemModal item={editingItem} girlId={curGirlId}
          onSave={handleSaveItem} onDelete={handleDeleteItem}
          onClose={() => { setShowItemModal(false); setEditingItem(null) }} />
      )}

      {showGirlModal && (
        <GirlModal2 onSave={handleAddGirl} onClose={() => setShowGirlModal(false)} />
      )}
    </div>
  )
}
