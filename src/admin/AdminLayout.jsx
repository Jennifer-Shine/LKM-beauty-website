import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          LKM <span>Beauty</span>
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            Products
          </Link>
          <Link to="/admin/orders" className="admin-nav-link">
            Orders
          </Link>
          <Link to="/" className="admin-nav-link">
            View site
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-user">{currentUser?.email}</span>
          <button className="btn btn-outline admin-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}