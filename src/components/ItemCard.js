import React from 'react'

export default function ItemCard({ item, onEdit, onToggleSold }) {
  const sold = item.sold

  return (
    <div style={{
      background: '#1A1A24',
      border: `1px solid ${sold ? '#FFFFFF0F' : '#FFFFFF14'}`,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'stretch',
      marginBottom: 8,
      overflow: 'hidden',
      opacity: sold ? 0.55 : 1,
      position: 'relative',
      transition: 'opacity 0.2s',
    }}>
      <div style={{
        width: 76, flexShrink: 0,
        background: '#22222E',
        borderRight: '1px solid #FFFFFF14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
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
          {item.category?.toUpperCase()} · {sold ? 'VENDIDO' : 'DISPONIBLE'}
        </div>

        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 15,
          color: '#C8FF00', fontWeight: 700,
        }}>
          ${Number(item.price).toFixed(0)}
          {item.original_price && item.original_price !== item.price && (
            <span style={{ fontSize: 11, color: '#6B6B80', textDecoration: 'line-through', marginLeft: 6 }}>
              ${Number(item.original_price).toFixed(0)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
          <button onClick={() => onEdit(item)} style={{
            fontSize: 10, padding: '5px 11px', borderRadius: 5,
            border: '1px solid #FFFFFF22', background: 'transparent',
            color: '#9090A8', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}>Editar</button>

          {sold
            ? <button onClick={() => onToggleSold(item)} style={{
                fontSize: 10, padding: '5px 11px', borderRadius: 5,
                border: '1px solid #FFFFFF22', background: 'transparent',
                color: '#6B6B80', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>↩ Deshacer</button>
            : <button onClick={() => onToggleSold(item)} style={{
                fontSize: 10, padding: '5px 11px', borderRadius: 5,
                border: '1px solid #4FFFB040', background: 'transparent',
                color: '#4FFFB0', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
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
  )
}
