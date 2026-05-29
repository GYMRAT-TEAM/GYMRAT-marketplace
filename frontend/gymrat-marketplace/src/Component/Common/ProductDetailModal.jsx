import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './ProductDetailModal.css';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  const images = product.images || [product.img];

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <>
      <div className="pdm-overlay" onClick={onClose} />
      <div className="pdm-modal">
        {/* Close */}
        <button className="pdm-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="pdm-body">
          {/* Image Gallery */}
          <div className="pdm-gallery">
            <div className="pdm-main-img-wrap">
              {product.badge && <span className="pdm-badge">{product.badge}</span>}
              {!product.inStock && <span className="pdm-badge out">OUT OF STOCK</span>}
              {discount && <span className="pdm-discount">-{discount}%</span>}
              <img
                src={images[activeImg]}
                alt={product.name}
                className="pdm-main-img"
              />
            </div>
            {images.length > 1 && (
              <div className="pdm-thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`pdm-thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pdm-info">
            <div className="pdm-brand">{product.brand}</div>
            <h2 className="pdm-name">{product.name}</h2>

            {/* Rating placeholder */}
            <div className="pdm-rating">
              {'★★★★☆'}
              <span className="pdm-reviews">(128 reviews)</span>
            </div>

            {/* Pricing */}
            <div className="pdm-pricing">
              <span className="pdm-price">{product.price?.toLocaleString()} <span className="pdm-currency">DZD</span></span>
              {product.oldPrice && (
                <span className="pdm-old-price">{product.oldPrice?.toLocaleString()} DZD</span>
              )}
            </div>

            {/* Stock status */}
            <div className={`pdm-stock ${product.inStock ? 'in' : 'out-stock'}`}>
              <span className="pdm-stock-dot"/>
              {product.inStock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
            </div>

            {/* Description */}
            {product.description && (
              <div className="pdm-desc">
                <div className="pdm-desc-label">Description</div>
                <p>{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div className="pdm-specs">
                <div className="pdm-desc-label">Specifications</div>
                <table className="pdm-specs-table">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={i}>
                        <td className="spec-key">{spec.key}</td>
                        <td className="spec-val">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Type & Category chips */}
            <div className="pdm-chips">
              {product.type && <span className="pdm-chip">{product.type}</span>}
              {product.sport && <span className="pdm-chip sport">{product.sport}</span>}
            </div>

            {/* Quantity + Add */}
            {product.inStock && (
              <div className="pdm-actions">
                <div className="pdm-qty">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <button
                  className={`pdm-add-btn ${added ? 'added' : ''}`}
                  onClick={handleAdd}
                >
                  {added ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      Added!
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Trust */}
            <div className="pdm-trust">
              <div className="pdm-trust-item">Free delivery on orders +10,000 DZD</div>
              <div className="pdm-trust-item">Easy 30-day returns</div>
              <div className="pdm-trust-item">Secure payment</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
