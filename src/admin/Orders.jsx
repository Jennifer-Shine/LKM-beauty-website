import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../firebase/orders";
import "./Orders.css";

const statuses = ["pending", "confirmed", "shipped", "completed", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Couldn't load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      setError("Couldn't update that order's status.");
      loadOrders();
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this order? This can't be undone.")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setError("Couldn't delete the order.");
    }
  }

  return (
    <div className="orders-page">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Sales</span>
          <h1>Orders</h1>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p className="dashboard-empty">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="dashboard-empty">No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <div className="order-card" key={o.id}>
              <div className="order-card-head">
                <div>
                  <span className="order-id">#{o.id.slice(0, 8)}</span>
                  <span className="order-date">
                    {o.createdAt?.toDate
                      ? o.createdAt.toDate().toLocaleString()
                      : ""}
                  </span>
                </div>
                <select
                  value={o.status || "pending"}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className={`order-status order-status-${o.status || "pending"}`}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="order-card-body">
                <div className="order-customer">
                  <strong>{o.customer?.name}</strong>
                  <span>{o.customer?.email}</span>
                  <span>{o.customer?.phone}</span>
                  <span>{o.customer?.address}</span>
                </div>

                <div className="order-items">
                  {o.items?.map((i) => (
                    <div className="order-item-row" key={i.id}>
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span>${(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-card-footer">
                <span className="order-total">
                  Total: ${o.total?.toFixed ? o.total.toFixed(2) : o.total}
                </span>
                <button className="link-btn link-btn-danger" onClick={() => handleDelete(o.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}