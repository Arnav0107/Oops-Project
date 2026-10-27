/**
 * ItemModal.jsx
 * Inventory management dialogue illustrating Templates (Inventory<T>)
 * and Operator Overloading (HealthPotion + HealthPotion = SuperPotion).
 */
import React from 'react';

export default function ItemModal({
  inventory = [],
  onUseItem,
  onCombinePotions,
  onClose
}) {
  const healthPotionCount = inventory.filter(
    (item) => item.type === 'health_potion'
  ).length;

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="tech-chip">TEMPLATE CLASS CONTAINER</span>
            <h3 className="heading-font" style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
              🎒 Inventory&lt;std::shared_ptr&lt;Item&gt;&gt;
            </h3>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close inventory">
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Items are stored generically in C++ template class <code>Inventory&lt;T&gt;</code> (capacity: 6).
          Derived items invoke overridden <code>use(Character& target)</code> polymorphically.
        </p>

        {/* Operator Overloading Synergy Banner */}
        {healthPotionCount >= 2 && (
          <div className="operator-synergy-banner">
            <div className="synergy-top">
              <span className="synergy-tag">OPERATOR OVERLOADING DEMO</span>
              <span className="synergy-symbol">HealthPotion + HealthPotion</span>
            </div>
            <div className="synergy-desc">
              Overloaded <code>operator+</code> combines two potions into a <strong>Super Health Potion (+85 HP)</strong> with synergy healing!
            </div>
            <button
              className="btn btn-primary"
              onClick={onCombinePotions}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginTop: '0.4rem', alignSelf: 'flex-start' }}
            >
              ⚗️ Combine Potions via operator+
            </button>
          </div>
        )}

        {/* Inventory Item List */}
        <div className="inventory-list">
          {inventory.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Your inventory is currently empty!
            </div>
          ) : (
            inventory.map((item, idx) => (
              <div key={idx} className="inventory-item-card">
                <div className="item-meta">
                  <div className="item-name-row">
                    <span className="item-icon">
                      {item.type === 'health_potion' && '🧪'}
                      {item.type === 'mana_potion' && '🔷'}
                      {item.type === 'weapon' && '⚔️'}
                      {item.type === 'armor' && '🛡️'}
                    </span>
                    <strong className="item-title">{item.name}</strong>
                    <code className="item-cpp-type">{item.type}</code>
                  </div>
                  <div className="item-desc">{item.description}</div>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => onUseItem(idx)}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                >
                  Use Item
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            Close Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
