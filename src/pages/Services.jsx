import { useEffect, useState } from "react";
import { getAllProducts } from "../firebase/products";
import { useCart } from "../context/CartContext";
import "./Services.css";

const fallbackProducts = [
  { id: "f1", name: "Rice Bran Glow Serum", category: "Serum", price: 24, description: "Brightens and evens tone with fermented rice bran extract." },
  { id: "f2", name: "Centella Calm Cream", category: "Moisturizer", price: 28, description: "Soothes redness and strengthens the skin barrier overnight." },
  { id: "f3", name: "Green Tea Water Toner", category: "Toner", price: 18, description: "A light, hydrating first step that preps skin for actives." },
  { id: "f4", name: "Snail Repair Ampoule", category: "Serum", price: 32, description: "Concentrated repair for dry, flaky, or over-exfoliated skin." },
  { id: "f5", name: "Cushion Foundation No.21", category: "Makeup", price: 26, description: "Buildable dewy coverage with SPF 50, no cakey finish." },
  { id: "f6", name: "Low pH Rice Cleanser", category: "Cleanser", price: 16, description: "A gentle first cleanse that keeps the skin barrier intact." },
];

const categories = ["All", "Cleanser", "Toner", "Serum", "Moisturizer", "Makeup"];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Services() {
  const { addItem } = useCart();
  const [products, setProducts] = useState(fallbackProducts);
  const [shuffled, setShuffled] = useState(fallbackProducts);
  const [active, setActive] = useState("All");
  const [added, setAdded] = useState(null);

  function handleAdd(p) {
    addItem(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1200);
  }

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        if (data.length) setProducts(data);
      })
      .catch(() => {
        // Firebase not configured yet — fallback products stay on screen.
      });
  }, []);

  // Re-shuffle whenever the product list changes (e.g. loads from Firestore),
  // so "All" shows a fresh random order without reshuffling on every click.
  useEffect(() => {
    setShuffled(shuffle(products));
  }, [products]);

  const visible =
    active === "All" ? shuffled : products.filter((p) => p.category === active);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container">
          <span className="eyebrow">Services &amp; products</span>
          <h1>Build your routine, step by step.</h1>
          <p>
            Browse by category or scroll through everything on the shelf.
            Each listing is pulled straight from our product catalog.
          </p>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          <div className="filter-row">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-chip ${active === c ? "is-active" : ""}`}
                onClick={() => {
                  if (c === "All" && active === "All") {
                    setShuffled(shuffle(products));
                  }
                  setActive(c);
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="empty-state">Nothing in this category yet.</p>
          ) : (
            <div className="services-grid">
              {visible.map((p) => (
                <article key={p.id} className="service-card">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="service-media" />
                  ) : (
                    <div className="service-media" aria-hidden="true" />
                  )}
                  <div className="service-body">
                    <span className="eyebrow">{p.category}</span>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="service-footer">
                      {p.price != null && (
                        <span className="service-price">${p.price}</span>
                      )}
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAdd(p)}
                      >
                        {added === p.id ? "Added ✓" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}