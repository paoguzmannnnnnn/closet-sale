import React, { useState } from 'react'

const GIRLS_COLORS = {}

function PaymentModal({ item, girls, onConfirm, onClose }) {
  const [method, setMethod] = useState('efectivo')
  const [toGirlId, setToGirlId] = useState('')

  const options = [
    { value: 'efectivo', label: '💵 Efectivo' },
    { value: 'transferencia', label: '📲 Transferencia' },
    { value: 'amiga', label: '👯 Pago a amiga' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.88)',
      zIndex: 300, display: 'flex', alignItems: 'flex-end',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#1A1A24', border: '1px solid #FFFFFF22',
        borderRadius: '20px 20px 0 0', padding: '24px 18px 32px', width: '100%',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4FF', marginBottom: 4 }}>
          ✓ Marcar como vendido
        </div>
        <div style={{ fontSize: 11, color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 20 }}>
          {item.name} · ${Number(item.price).toFixed(0)}
        </div>

        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>
          Método de pago
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {options.map(opt => (
            <button key={opt.value} onClick={() => setMethod(opt.value)} style={{
              padding: '12px 16px', borderRadius: 8, textAlign: 'left',
              border: `1px solid ${method === opt.value ? '#C8FF00' : '#FFFFFF22'}`,
              background: method === opt.value ? '#C8FF0012' : 'transparent',
              color: method === opt.value ? '#C8FF00' : '#9090A8',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
            }}>{opt.label}</button>
          ))}
        </div>

        {method === 'amiga' && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>
              ¿A cuál amiga?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {girls.map(g => (
                <button key={g.id} onClick={() => setToGirlId(g.id)} style={{
                  padding: '10px 14px', borderRadius: 8, textAlign: 'left',
                  border: `1px solid ${toGirlId === g.id ? g.color : '#FFFFFF22'}`,
                  background: toGirlId === g.id ? g.color + '15' : 'transparent',
                  color: toGirlId === g.id ? g.color : '#9090A8',
                  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: g.color, display: 'inline-block' }} />
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={onClose} style={{
            padding: '12px 16px', border: '1px solid #FFFFFF22', borderRadius: 8,
            background: 'transparent', color: '#9090A8', fontSize: 12,
            fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={() => onConfirm(method, method === 'amiga' ? toGirlId : null)} style={{
            flex: 1, padding: 12, borderRadius: 8, border: 'none',
            background: '#C8FF00', color: '#0A0A0F', fontSize: 12,
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
          }}>Confirmar venta</button>
        </div>
      </div>
    </div>
  )
}

export default function ItemCard({ item, girls = [], onEdit, onToggleSold }) {
  const [showPayment, setShowPayment] = useState(false)
  const sold = item.sold

  function handleSellClick() {
    if (sold) {
      onToggleSold(item, null, null)
    } else {
      setShowPayment(true)
    }
  }

  function handleConfirmPayment(method, toGirlId) {
    setShowPayment(false)
    onToggleSold(item, method, toGirlId)
  }

  const paymentLabel = sold && item.payment_method
    ? { efectivo: '💵', transferencia: '📲', amiga: '👯' }[item.payment_method] || ''
    : ''

  return (
    <>
      <div style={{
        background: '#1A1A24',
        border: `1px solid ${sold ? '#FFFFFF0F' : '#FFFFFF14'}`,
        borderRadius: 12, display: 'flex', alignItems: 'stretch',
        marginBottom: 8, overflow: 'hidden', opacity: sold ? 0.55 : 1,
        position: 'relative', transition: 'opacity 0.2s',
      }}>
        <div style={{
          width: 76, flexShrink: 0, background: '#22222E',
          borderRight: '1px solid #FFFFFF14',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {item.photo_url
            ? <img src={item.photo_url} alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 28 }}>{item.emoji || '👗'}</span>
          }
        </div>

        <div style={{ flex: 1, padding: '11px 13px', minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 500, color: '#F4F4FF',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2,
          }}>{item.name}</div>

          <div style={{
            fontSize: 10, color: '#6B6B80', fontFamily: "'Space Mono', monospace", marginBottom: 7,
          }}>
            {item.category?.toUpperCase()} · {sold ? `VENDIDO ${paymentLabel}` : 'DISPONIBLE'}
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#C8FF00', fontWeight: 700 }}>
            ${Number(item.price).toFixed(0)}
            {item.original_price && Number(item.original_price) !== Number(item.price) && (
              <span style={{ fontSize: 11, color: '#6B6B80', textDecoration: 'line-through', marginLeft: 6 }}>
                ${Number(item.original_price).toFixed(0)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
            <button onClick={() => onEdit(item)} style={{
              fontSize: 10, padding: '5px 11px', borderRadius: 5,
              border: '1px solid #FFFFFF22', background: 'transparent',
              color: '#9090A8', fontWeight: 500, letterSpacing: '0.04em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>Editar</button>

            {sold
              ? <button onClick={handleSellClick} style={{
                  fontSize: 10, padding: '5px 11px', borderRadius: 5,
                  border: '1px solid #FFFFFF22', background: 'transparent',
                  color: '#6B6B80', fontWeight: 500, letterSpacing: '0.04em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>↩ Deshacer</button>
              : <button onClick={handleSellClick} style={{
                  fontSize: 10, padding: '5px 11px', borderRadius: 5,
                  border: '1px solid #4FFFB040', background: 'transparent',
                  color: '#4FFFB0', fontWeight: 500, letterSpacing: '0.04em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>✓ Vendido</button>
            }
          </div>
        </div>

        {sold && (
          <div style={{
            position: 'absolute', top: 9, right: 10,
            background: '#4FFFB0', color: '#0A0A0F',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
            fontFamily: "'Space Mono', monospace",
          }}>Sold</div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          item={item}
          girls={girls}
          onConfirm={handleConfirmPayment}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  )
}
