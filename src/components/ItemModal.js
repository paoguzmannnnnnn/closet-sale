import React, { useState, useEffect, useRef } from 'react'
import { CATEGORIES } from '../lib/supabase'

const EMOJIS = ['👗','👚','👖','👠','👡','👜','🧥','🧣','💍','🕶️','🎀','🧤','👒','💎']

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.88)',
    zIndex: 200, display: 'flex', alignItems: 'flex-end',
  },
  sheet: {
    background: '#1A1A24', border: '1px solid #FFFFFF22',
    borderRadius: '20px 20px 0 0', padding: '24px 18px 32px',
    width: '100%', maxHeight: '92vh', overflowY: 'auto',
  },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 600, color: '#F4F4FF', letterSpacing: '-0.01em' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8, border: '1px solid #FFFFFF22',
    background: 'transparent', color: '#9090A8', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer',
  },
  fieldWrap: { marginBottom: 14 },
  label: {
    display: 'block', fontSize: 10, textTransform: 'uppercase',
    letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace",
    marginBottom: 6,
  },
  input: {
    width: '100%', padding: '10px 13px', border: '1px solid #FFFFFF22',
    borderRadius: 8, background: '#22222E', color: '#F4F4FF',
    fontSize: 13, outline: 'none',
  },
  select: {
    width: '100%', padding: '10px 13px', border: '1px solid #FFFFFF22',
    borderRadius: 8, background: '#22222E', color: '#F4F4FF',
    fontSize: 13, outline: 'none',
  },
  photoBox: {
    border: '1px dashed #FFFFFF22', borderRadius: 10, padding: '16px',
    textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
    background: '#22222E',
  },
  photoPreview: {
    width: '100%', height: 160, objectFit: 'cover', borderRadius: 8,
    display: 'block', marginBottom: 8,
  },
  emojiRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 },
  emojiOpt: (sel) => ({
    fontSize: 20, cursor: 'pointer', padding: 7, borderRadius: 6,
    border: `1px solid ${sel ? '#C8FF00' : 'transparent'}`,
    background: sel ? '#C8FF0015' : 'transparent', transition: 'all 0.15s',
  }),
  actions: { display: 'flex', gap: 8, marginTop: 20 },
  btnCancel: {
    padding: '12px 18px', border: '1px solid #FFFFFF22', borderRadius: 8,
    background: 'transparent', color: '#9090A8', fontSize: 12,
    fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  btnSave: {
    flex: 1, padding: 12, borderRadius: 8, border: 'none',
    background: '#C8FF00', color: '#0A0A0F', fontSize: 12,
    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    opacity: 1, transition: 'opacity 0.15s',
  },
  btnDelete: {
    padding: '12px 14px', border: '1px solid #FF6B6B44', borderRadius: 8,
    background: 'transparent', color: '#FF6B6B', fontSize: 12,
    fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
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
  const fileRef = useRef()
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
    if (!item) return
    if (window.confirm(`¿Eliminar "${item.name}"?`)) {
      await onDelete(item.id)
      onClose()
    }
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.sheet}>
        <div style={styles.hdr}>
          <div style={styles.title}>{isEdit ? 'Editar item' : 'Nuevo item'}</div>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Foto</label>
          <div style={styles.photoBox} onClick={() => fileRef.current.click()}>
            {photoPreview
              ? <img src={photoPreview} alt="preview" style={styles.photoPreview} />
              : <div style={{ color: '#6B6B80', fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                  <div>Tap para subir foto</div>
                  <div style={{ fontSize: 11, marginTop: 3, color: '#555' }}>desde cámara o galería</div>
                </div>
            }
            {photoPreview && (
              <div style={{ fontSize: 11, color: '#6B6B80', fontFamily: "'Space Mono', monospace" }}>
                tap para cambiar foto
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }} onChange={handlePhoto} />
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Nombre</label>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)}
            placeholder="Ej: Blazer negro oversized" />
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Precio ($)</label>
          <input style={styles.input} type="number" value={price}
            onChange={e => setPrice(e.target.value)} placeholder="0.00" />
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Categoría</label>
          <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {!photoPreview && (
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Emoji (si no hay foto)</label>
            <div style={styles.emojiRow}>
              {EMOJIS.map(em => (
                <span key={em} style={styles.emojiOpt(em === emoji)} onClick={() => setEmoji(em)}>{em}</span>
              ))}
            </div>
          </div>
        )}

        <div style={styles.actions}>
          {isEdit && (
            <button style={styles.btnDelete} onClick={handleDelete}>Eliminar</button>
          )}
          <button style={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={{ ...styles.btnSave, opacity: saving ? 0.6 : 1 }}
            onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
