import React, { useState } from 'react'
import { GIRL_ACCENTS } from '../lib/supabase'

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.88)',
    zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    background: '#1A1A24', border: '1px solid #FFFFFF22',
    borderRadius: 16, padding: 24, width: '100%',
  },
  title: { fontSize: 16, fontWeight: 600, color: '#F4F4FF', marginBottom: 20 },
  label: {
    display: 'block', fontSize: 10, textTransform: 'uppercase',
    letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 6,
  },
  input: {
    width: '100%', padding: '10px 13px', border: '1px solid #FFFFFF22',
    borderRadius: 8, background: '#22222E', color: '#F4F4FF', fontSize: 13, outline: 'none',
    marginBottom: 16,
  },
  colorsRow: { display: 'flex', gap: 10, marginBottom: 20 },
  colorDot: (col, sel) => ({
    width: 32, height: 32, borderRadius: '50%', background: col, cursor: 'pointer',
    border: sel ? `3px solid #F4F4FF` : '3px solid transparent',
    transition: 'border-color 0.15s',
  }),
  actions: { display: 'flex', gap: 8 },
  btnCancel: {
    padding: '11px 16px', border: '1px solid #FFFFFF22', borderRadius: 8,
    background: 'transparent', color: '#9090A8', fontSize: 12,
    fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  btnSave: {
    flex: 1, padding: 11, borderRadius: 8, border: 'none',
    background: '#C8FF00', color: '#0A0A0F', fontSize: 12,
    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
  },
}

export default function GirlModal({ onSave, onClose }) {
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
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.card}>
        <div style={styles.title}>Agregar amiga</div>
        <label style={styles.label}>Nombre</label>
        <input style={styles.input} value={name} onChange={e => setName(e.target.value)}
          placeholder="Ej: Sofía" autoFocus />
        <label style={styles.label}>Color</label>
        <div style={styles.colorsRow}>
          {GIRL_ACCENTS.map(c => (
            <div key={c} style={styles.colorDot(c, c === color)} onClick={() => setColor(c)} />
          ))}
        </div>
        <div style={styles.actions}>
          <button style={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={styles.btnSave} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
