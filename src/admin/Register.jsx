import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "./AdminAuth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.code === "auth/email-already-in-use"
        ? "An account with this email already exists."
        : "Could not create the account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <span className="eyebrow">Admin</span>
        <h1>Create account</h1>
        <p className="admin-auth-sub">For staff who manage the LKM Beauty catalog.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary admin-auth-submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="admin-auth-links">
          <Link to="/admin/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}