import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../firebase/products";
import { useCart } from "../context/CartContext";
import "./Home.css";

const fallbackProducts = [
  {
    id: "f1",
    name: "Rice Bran Glow Serum",
    category: "Serum",
    price: 24,
    description: "Brightens and evens tone with fermented rice bran extract.",
  },
  {
    id: "f2",
    name: "Centella Calm Cream",
    category: "Moisturizer",
    price: 28,
    description: "Soothes redness and strengthens the skin barrier overnight.",
  },
  {
    id: "f3",
    name: "Green Tea Water Toner",
    category: "Toner",
    price: 18,
    description: "A light, hydrating first step that preps skin for actives.",
  },
];

const ingredients = [
  {
    mark: "01",
    title: "Sourced with intention",
    text: "Every formula starts with ingredients used in Korean skincare for generations — rice, centella, green tea, snail mucin.",
  },
  {
    mark: "02",
    title: "Routine, not ritual overload",
    text: "We build small, effective routines instead of ten-step regimens you won't keep up with.",
  },
  {
    mark: "03",
    title: "Tested on real skin",
    text: "Formulas are trialed across skin tones and types before they reach the shelf.",
  },
];

export default function Home() {
  const { addItem } = useCart();
  const [products, setProducts] = useState(fallbackProducts);
  const [added, setAdded] = useState(null);

  function handleAdd(p) {
    addItem(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1200);
  }

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        if (data.length) setProducts(data.slice(0, 3));
      })
      .catch(() => {
        // Firebase not configured yet — fallback products stay on screen.
      });
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <span className="eyebrow">Korean skincare &amp; makeup</span>
          <h1 className="hero-title">
            Skin that looks
            <br />
            like <em>skin</em>, not filter.
          </h1>
          <p className="hero-copy">
            LKM Beauty curates Korean skincare and makeup essentials built
            around glass-skin basics: gentle cleansing, real hydration, and
            formulas you can actually keep up with.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary">
              Shop the routine
            </Link>
            <Link to="/about" className="btn btn-outline">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured</span>
            <h2>This week's essentials</h2>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <article key={p.id} className="product-card">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="product-media" />
                ) : (
                  <div className="product-media" aria-hidden="true" />
                )}
                <div className="product-body">
                  <span className="eyebrow">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="product-footer">
                    {p.price != null && (
                      <span className="product-price">${p.price}</span>
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
        </div>
      </section>

      <section className="ingredients">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why LKM</span>
            <h2>Read the label</h2>
          </div>

          <div className="ingredients-list">
            {ingredients.map((i) => (
              <div className="ingredient-row" key={i.mark}>
                <span className="ingredient-mark">{i.mark}</span>
                <div>
                  <h3>{i.title}</h3>
                  <p>{i.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h2>Not sure where to start?</h2>
          <p>Tell us about your skin and we'll help you build a routine.</p>
          <Link to="/contact" className="btn btn-outline-light">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}