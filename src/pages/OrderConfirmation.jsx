import { Link, useLocation, Navigate } from "react-router-dom";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="confirmation-page">
      <div className="container confirmation-inner">
        <span className="eyebrow">Order placed</span>
        <h1>Thank you{state.name ? `, ${state.name}` : ""}.</h1>
        <p>
          Your order has been received and is being reviewed by our team.
          You'll get a confirmation email shortly.
        </p>

        <div className="confirmation-card">
          <div className="confirmation-row">
            <span>Order ID</span>
            <span>{state.orderId?.slice(0, 8)}</span>
          </div>
          <div className="confirmation-row">
            <span>Total</span>
            <span>${state.total?.toFixed(2)}</span>
          </div>
        </div>

        <Link to="/services" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}