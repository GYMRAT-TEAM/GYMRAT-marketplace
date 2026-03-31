import { useCart } from "../context/CartContext";

export default function Products() {
  const { addToCart } = useCart();

  const products = [
    { name: "Protein Powder", price: 49.99 },
    { name: "Gym Gloves", price: 19.99 },
    { name: "Pre Workout", price: 29.99 }
  ];

  return (
    <section id="products">
      {products.map((item, i) => (
        <div key={i}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>

          <button onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </section>
  );
}