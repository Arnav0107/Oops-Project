import React from 'react';
import { X, FlaskConical, Shield, Sword, Plus } from 'lucide-react';

export default function ItemModal({
  inventory = [],
  onUseItem,
  onCombinePotions,
  onClose
}) {
  const healthPotionCount = inventory.filter(
    (item) => item.type === 'health_potion'
  ).length;

  const getItemIcon = (type) => {
    switch (type) {
      case 'health_potion':
      case 'mana_potion':
        return <FlaskConical size={16} strokeWidth={2} />;
      case 'weapon':
        return <Sword size={16} strokeWidth={2} />;
      case 'armor':
        return <Shield size={16} strokeWidth={2} />;
      default:
        return <FlaskConical size={16} strokeWidth={2} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Inventory</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close inventory">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Combine Potions Option */}
        {healthPotionCount >= 2 && (
          <div className="combine-box">
            <div className="combine-info">
              <span className="combine-title">Combine potions</span>
              <p className="combine-desc">
                Combine two health potions to create a super health potion with boosted healing.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={onCombinePotions}
            >
              <Plus size={14} strokeWidth={2} />
              <span>Combine</span>
            </button>
          </div>
        )}

        {/* Item List */}
        <div className="item-list">
          {inventory.length === 0 ? (
            <div className="item-empty">Your inventory is empty.</div>
          ) : (
            inventory.map((item, idx) => (
              <div key={idx} className="item-row">
                <div className="item-details">
                  <div className="item-name-line">
                    <span className="item-type-icon">{getItemIcon(item.type)}</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <div className="item-desc">{item.description}</div>
                </div>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={() => onUseItem(idx)}
                >
                  Use item
                </button>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary full-width" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
