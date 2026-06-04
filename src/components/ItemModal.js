import React, { useState, useEffect, useRef } from 'react'

const CATEGORIES = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'zapatos', label: 'Zapatos' },
  { value: 'bags', label: 'Bags' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'outerwear', label: 'Outerwear' },
]

const EMOJIS = ['👗','👚','👖','👠','👡','👜','🧥','🧣','💍','🕶️','🎀','🧤','👒','💎']

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.88)',
    zIndex: 200, display: 'flex', alignItems: 'flex-end',
  },
  sheet: {
    background: '#1A1A24', border: '1px solid #FFFFFF22',
    borderRadius: '20px 20px 0 0', padding: '24px 18px 32px',
    width: '100%', maxHeight: '92vh', overflowY: 'auto',
  },
  label: {
    display: 'block', fontSize: 10, textTransform: 'uppercase',
    letterSpacing: '0.1em', color: '#6B6B80',
    fontFamily: "'Space Mono', monospace", marginBottom: 6,
  },
  input: {
    width: '100%', padding: '10px 13px', border: '1px solid #FFFFFF22',
    borderRadius: 8, background: '#22222E', color: '#F4F4FF', fontSize: 13, outline: 'none',
  },
  select: {
    width: '100%', padding: '10px 13px', border: '1px solid #FFFFFF22',
    borderRadius: 8, background: '#22222E', color: '#F4F4FF', fontSize: 13, outline: 'none',
  },
}

export default function ItemModal({ item, girlId, onSave, onDelete, onClose }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('tops')
  const [emoji, setEmoji] = useState('👗')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const galleryRef = useRef()
  const cameraRef = useRef()
  const isEdit = !!item

  useEffect(() => {
    if (item) {
      setName(item.name || '')
      setPrice(item.price || '')
      setCategory(item.category || 'tops')
      setEmoji(item.emoji || '👗')
      setPhotoPreview(item.photo_url || null)
    }
  }, [item])

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), price, category, emoji, girlId, photoFile }, item?.id)
    setSaving(false)
    onClose()
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar "${item.name}"?`)) return
    await onDelete(item.id)
    onClose()
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.sheet}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#F4F4FF' }}>
            {isEdit ? 'Editar item' : 'Nuevo item'}
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid #FFFFFF22',
            background: 'transparent', color: '#9090A8', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Photo upload - gallery OR camera separately */}
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Foto</label>
          {photoPreview && (
            <img src={photoPreview} alt="preview" style={{
              width: '100%', height: 160, objectFit: 'cover',
              borderRadius: 8, display: 'block', marginBottom: 8,
            }} />
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => galleryRef.current.click()} style={{
              flex: 1, padding: '11px 8px', border: '1px dashed #FFFFFF22',
              borderRadius: 8, background: '#22222E', color: '#9090A8',
              fontSize: 12, cursor: 'pointer', fontWeight: 500,
            }}>
              🖼️ Galería
            </button>
            <button onClick={() => cameraRef.current.click()} style={{
              flex: 1, padding: '11px 8px', border: '1px dashed #FFFFFF22',
              borderRadius: 8, background: '#22222E', color: '#9090A8',
              fontSize: 12, cursor: 'pointer', fontWeight: 500,
            }}>
              📷 Cámara
            </button>
          </div>
          {/* Gallery input - no capture attribute */}
          <input ref={galleryRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handlePhoto} />
          {/* Camera input - forces camera */}
          <input ref={cameraRef} type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }} onChange={handlePhoto} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Nombre</label>
          <input style={s.input} value={name} onChange={e => setName(e.target.value)}
            placeholder="Ej: Blazer negro oversized" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Precio ($)</label>
          <input style={s.input} type="number" value={price}
            onChange={e => setPrice(e.target.value)} placeholder="0.00" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Categoría</label>
          <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {!photoPreview && (
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>Emoji (si no hay foto)</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {EMOJIS.map(em => (
                <span key={em} onClick={() => setEmoji(em)} style={{
                  fontSize: 20, cursor: 'pointer', padding: 7, borderRadius: 6,
                  border: `1px solid ${em === emoji ? '#C8FF00' : 'transparent'}`,
                  background: em === emoji ? '#C8FF0015' : 'transparent',
                  transition: 'all 0.15s',
                }}>{em}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {isEdit && (
            <button onClick={handleDelete} style={{
              padding: '12px 14px', border: '1px solid #FF6B6B44', borderRadius: 8,
              background: 'transparent', color: '#FF6B6B', fontSize: 12,
              fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}>Eliminar</button>
          )}
          <button onClick={onClose} style={{
            padding: '12px 18px', border: '1px solid #FFFFFF22', borderRadius: 8,
            background: 'transparent', color: '#9090A8', fontSize: 12,
            fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: 12, borderRadius: 8, border: 'none',
            background: '#C8FF00', color: '#0A0A0F', fontSize: 12,
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', opacity: saving ? 0.6 : 1,
          }}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  )
}
