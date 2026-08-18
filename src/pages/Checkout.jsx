import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../firebase/orders";
import "./Checkout.css";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setError("");
    try {
      const orderId = await createOrder({
        customer: form,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        total: subtotal,
      });
      clearCart();
      navigate("/order-confirmation", {
        state: { orderId: orderId.id, total: subtotal, name: form.name },
      });
    } catch (err) {
      setError("Couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container cart-empty">
          <span className="eyebrow">Checkout</span>
          <h1>Your cart is empty.</h1>
          <Link to="/services" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <span className="eyebrow">Checkout</span>
          <h1>Delivery details</h1>

          {error && <div className="form-error">{error}</div>}

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary checkout-submit" disabled={submitting}>
            {submitting ? "Placing order..." : `Place order — $${subtotal.toFixed(2)}`}
          </button>

          <p className="checkout-note">
            This is a class-project checkout — no real payment is processed.
            Your order is saved so an admin can review it.
          </p>
        </form>

        <div className="checkout-summary">
          <h2>Order summary</h2>
          <div className="checkout-items">
            {items.map((i) => (
              <div className="checkout-item" key={i.id}>
                <span>
                  {i.name} <span className="checkout-item-qty">× {i.qty}</span>
                </span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}