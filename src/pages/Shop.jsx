import { useState } from 'react';
import goalData from '../Constants/goalData';
import { useCart } from '../context/CartContext';
import './Shop.css';

const goals = [
  { key: 'muscle', cat: 'Bulking', name: 'BUILD MUSCLE', img: 'https://i.pinimg.com/736x/f9/9c/8a/f99c8ac24d6c3aa868478a8c27ca4d2f.jpg', alt: 'Build Muscle' },
  { key: 'fat', cat: 'Cutting', name: 'BURN FAT', img: 'https://i.pinimg.com/1200x/4f/82/39/4f82392a86be8e6172ea3de91423f4ed.jpg', alt: 'Burn Fat' },
  { key: 'strength', cat: 'Performance', name: 'STRENGTH & POWER', img: 'https://i.pinimg.com/736x/3b/5c/69/3b5c691ce31116868ca97a369367c9ce.jpg', alt: 'Strength & Power' },
  { key: 'endurance', cat: 'Cardio', name: 'ENDURANCE TRAINING', img: 'https://i.pinimg.com/1200x/aa/40/ea/aa40ea281fdbc0816e6b53118c3c6d79.jpg', alt: 'Endurance Training' },
  { key: 'flexibility', cat: 'Mobility', name: 'FLEXIBILITY & MOBILITY', img: 'https://i.pinimg.com/736x/27/ce/47/27ce4740cdf3c21c7437c18263298a97.jpg', alt: 'Flexibility & Mobility' },
  { key: 'recovery', cat: 'Wellness', name: 'RECOVERY & WELLNESS', img: 'https://i.pinimg.com/736x/10/2f/47/102f47bdf764c12902d83247df614106.jpg', alt: 'Recovery & Wellness' },
];

function TodoPanel({ goalKey, onClose }) {
  const { checkedItems = {}, toggleItem } = useCart();
  if (!goalKey) return null;

  const data = goalData[goalKey];
  if (!data) return null;

  const allItems = data.sections.flatMap(s => s.items);
  const done = allItems.filter(i => checkedItems[i.id]).length;
  const pct = allItems.length ? Math.round((done / allItems.length) * 100) : 0;
  const total = allItems.reduce((s, i) => s + i.price, 0);
  const saved = allItems.filter(i => checkedItems[i.id]).reduce((s, i) => s + i.price, 0);

  return (
    <>
      <div className="todo-overlay open" onClick={onClose}></div>
      <div className="todo-panel open">
        <div className="todo-panel-header">
          <button className="todo-panel-close" onClick={onClose}>×</button>
          <div className="todo-panel-tag">{data.tag}</div>
          <div className="todo-panel-title">{data.title}</div>
          <div className="todo-panel-sub">{data.sub}</div>
          <div className="todo-progress-wrap">
            <div className="todo-progress-bar-bg">
              <div className="todo-progress-bar" style={{ width: pct + '%' }}></div>
            </div>
            <div className="todo-progress-label">{done} / {allItems.length} done</div>
          </div>
        </div>

        <div className="todo-panel-body">
          {data.sections.map(section => (
            <div key={section.label}>
              <div className="todo-section-title">{section.label}</div>
              {section.items.map(item => (
                <div
                  key={item.id}
                  className={`todo-item${checkedItems[item.id] ? ' checked' : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="todo-checkbox">{checkedItems[item.id] ? '✓' : ''}</div>
                  <div className="todo-item-content">
                    <div className="todo-item-name">{item.name}</div>
                    <div className="todo-item-desc">{item.desc}</div>
                  </div>
                  <div className="todo-item-price">${item.price}</div>
                  <div className={`todo-item-priority ${item.priority}`}>
                    {item.priority === 'must' ? 'MUST' : item.priority === 'nice' ? 'NICE' : 'OPT'}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="todo-panel-footer">
          <div className="todo-total-row">
            <span className="todo-total-label">Estimated Total</span>
            <span className="todo-total-price">
              ${total}{saved > 0 && <span className="todo-total-checked"> ✓ ${saved} planned</span>}
            </span>
          </div>
          <button className="btn-shop-all" onClick={() => { window.location.hash = '#products'; onClose(); }}>
            SHOP ALL ITEMS
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function Shop() {
  const [activeGoal, setActiveGoal] = useState(null);
  const { checkedItems = {} } = useCart();

  const getRemainingCount = (goalKey) => {
    if (!goalData[goalKey]) return 0;
    const allItems = goalData[goalKey].sections.flatMap(s => s.items);
    return allItems.filter(i => !checkedItems?.[i.id]).length;
  };

  return (
    <>
      <section id="shop">
        <div className="goals-header">
          <div>
            <div className="section-label">Find Your Path</div>
            <h2 className="section-title">SHOP BY <em>GOALS</em></h2>
          </div>
          <a href="#products" className="btn-primary">VIEW ALL</a>
        </div>

        <div className="goals-grid">
          {goals.map(g => (
            <div className="goal-card" key={g.key}>
              <button
                className="goal-todo-btn"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveGoal(g.key); }}
                title="View shopping list"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8a6 6 0 00-12 0c0 4-2 6-2 6h16s-2-2-2-6z"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <span className="goal-todo-badge">{getRemainingCount(g.key)}</span>
              </button>

              <div className="goal-img-wrap">
                <img src={g.img} alt={g.alt} className="goal-img" />
                <div className="goal-img-overlay" />
              </div>

              <div className="goal-body">
                <div className="goal-cat">{g.cat}</div>
                <div className="goal-name">{g.name}</div>
                <div className="goal-desc">{g.desc}</div>
                <div className="goal-btn" onClick={() => setActiveGoal(g.key)}>
                  VIEW LIST
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeGoal && <TodoPanel goalKey={activeGoal} onClose={() => setActiveGoal(null)} />}
    </>
  );
}


