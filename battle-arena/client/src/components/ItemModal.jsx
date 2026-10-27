import React from 'react';

export default function ItemModal({
  inventory,
  onUseItem,
  onCombinePotions,
  onClose
}) {
  const healthPotionCount = inventory.filter(
    (item) => item.type === 'health_potion'
  ).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="heading-font" style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>
            🎒 Inventory ({inventory.length}/6)
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Managed via template class <code style={{ color: '#c4b5fd' }}>Inventory&lt;std::shared_ptr&lt;Item&gt;&gt;</code>. Select an item to consume or combine.
        </p>

        {healthPotionCount >= 2 && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '8px',
            padding: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#d8b4fe' }}>
                ⚗️ Operator Overloading Synergy
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Combine 2 Health Potions via <code style={{ color: '#c4b5fd' }}>operator+</code> to forge a Super Potion!
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={onCombinePotions}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderColor: 'var(--accent-purple)' }}
            >
              Combine (+)
            </button>
          </div>
        )}

        <div className="inventory-list">
          {inventory.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Your inventory is currently empty!
            </div>
          ) : (
            inventory.map((item, idx) => (
              <div
                key={idx}
                className="inventory-item"
                onClick={() => onUseItem(idx)}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.description}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
                >
                  Use Item
                </button>
              </div>
            ))
          )}
        </div>

        <button
          className="btn btn-secondary"
          onClick={onClose}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
