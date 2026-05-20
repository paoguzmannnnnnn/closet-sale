import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard({ girls }) {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data } = await supabase.from('items').select('*')
    setAllItems(data || [])
    setLoading(false)
  }

  const totalSold = allItems.filter(i => i.sold).reduce((a, i) => a + Number(i.price), 0)
  const totalAll = allItems.reduce((a, i) => a + Number(i.price), 0)
  const totalSoldCount = allItems.filter(i => i.sold).length

  if (loading) return (
    <div style={{ padding: 24, textAlign: 'center', color: '#6B6B80', fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
      CARGANDO...
    </div>
  )

  return (
    <div style={{ padding: '18px 18px 40px' }}>
      <div style={{
        background: '#1A1A24', border: '1px solid #FFFFFF22',
        borderRadius: 14, padding: '18px 20px', marginBottom: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>
            Total recaudado
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700, color: '#C8FF00', letterSpacing: '-0.02em' }}>
            ${totalSold.toFixed(0)}
          </div>
          <div style={{ fontSize: 11, color: '#6B6B80', marginTop: 4, fontFamily: "'Space Mono', monospace" }}>
            {totalSoldCount} items vendidos
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#6B6B80', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace", marginBottom: 4, textTransform: 'uppercase' }}>Potencial</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: '#6B6B80' }}>${totalAll.toFixed(0)}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, color: '#F4F4FF', marginBottom: 12, letterSpacing: '-0.01em' }}>
        Por amiga
      </div>

      {girls.map(girl => {
        const its = allItems.filter(i => i.girl_id === girl.id)
        const sold = its.filter(i => i.sold)
        const earn = sold.reduce((a, i) => a + Number(i.price), 0)
        const pot = its.reduce((a, i) => a + Number(i.price), 0)
        const pct = pot > 0 ? Math.round(earn / pot * 100) : 0
        const accent = girl.color || '#C8FF00'

        return (
          <div key={girl.id} style={{
            background: '#1A1A24', border: '1px solid #FFFFFF14',
            borderRadius: 12, padding: '14px 16px', marginBottom: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: accent + '20', color: accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700,
                }}>
                  {girl.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F4F4FF' }}>{girl.name}</div>
                  <div style={{ fontSize: 10, color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginTop: 1 }}>
                    {sold.length}/{its.length} vendidos · {pct}%
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, color: accent }}>
                ${earn.toFixed(0)}
              </div>
            </div>
            <div style={{ background: '#2A2A38', borderRadius: 2, height: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: accent, width: `${pct}%`, transition: 'width 0.6s' }} />
            </div>
          </div>
        )
      })}

      {girls.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 0', color: '#6B6B80', fontSize: 12, fontFamily: "'Space Mono', monospace" }}>
          Agrega amigas primero
        </div>
      )}
    </div>
  )
}
