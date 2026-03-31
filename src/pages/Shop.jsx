import { useState } from 'react';
import goalData from '../Constants/goalData';
import { useCart } from '../context/CartContext';
import './Shop.css';

const goals = [
  {
    key: 'muscle',
    cat: 'Bulking',
    name: 'BUILD MUSCLE',
    desc: 'Gain lean mass and strength.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    alt: 'Build Muscle',
    count: 8,
  },
  {
    key: 'fat',
    cat: 'Cutting',
    name: 'BURN FAT',
    desc: 'Shed fat while maintaining muscle.',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    alt: 'Burn Fat',
    count: 6,
  },
  {
    key: 'strength',
    cat: 'Performance',
    name: 'STRENGTH & POWER',
    desc: 'Maximize lifts and overall power.',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80',
    alt: 'Strength & Power',
    count: 7,
  },
  {
    key: 'endurance',
    cat: 'Cardio',
    name: 'ENDURANCE TRAINING',
    desc: 'Boost stamina and cardio fitness.',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
    alt: 'Endurance Training',
    count: 5,
  },
  {
    key: 'flexibility',
    cat: 'Mobility',
    name: 'FLEXIBILITY & MOBILITY',
    desc: 'Stay agile and prevent injuries.',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    alt: 'Flexibility & Mobility',
    count: 6,
  },
  {
    key: 'recovery',
    cat: 'Wellness',
    name: 'RECOVERY & WELLNESS',
    desc: 'Prioritize rest, sleep, and nutrition.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    alt: 'Recovery & Wellness',
    count: 9,
  },
];

function TodoPanel({ goalKey, onClose }) {
  const { checkedItems, toggleItem } = useCart();
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
  const { checkedItems } = useCart();

  const getRemainingCount = (goalKey) => {
    if (!goalData[goalKey]) {
      const g = goals.find(g => g.key === goalKey);
      return g ? g.count : 0;
    }
    const allItems = goalData[goalKey].sections.flatMap(s => s.items);
    return allItems.filter(i => !checkedItems[i.id]).length;
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
                📋
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
                <div
                  className="goal-btn"
                  onClick={() => setActiveGoal(g.key)}
                >
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