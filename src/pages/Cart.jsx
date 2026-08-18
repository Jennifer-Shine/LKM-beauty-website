import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty">
          <span className="eyebrow">Your cart</span>
          <h1>Nothing here yet.</h1>
          <p>Add a few products from the shelf to get started.</p>
          <Link to="/services" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <span className="eyebrow">Your cart</span>
        <h1>Review your order</h1>

        <div className="cart-list">
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              {item.image ? (
                <img src={item.image} alt={item.name} className="cart-thumb" />
              ) : (
                <div className="cart-thumb cart-thumb-empty" />
              )}

              <div className="cart-row-info">
                <span className="eyebrow">{item.category}</span>
                <h3>{item.name}</h3>
                <span className="cart-row-price">${item.price}</span>
              </div>

              <div className="cart-qty">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-row-total">
                ${(item.price * item.qty).toFixed(2)}
              </div>

              <button
                className="cart-remove"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span className="cart-summary-total">${subtotal.toFixed(2)}</span>
          </div>
          <p className="cart-summary-note">
            Shipping and any taxes are calculated at checkout.
          </p>
          <button
            className="btn btn-primary cart-checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>
          <Link to="/services" className="cart-continue">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}