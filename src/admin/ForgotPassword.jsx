import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminAuth.css";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      await resetPassword(email);
      setStatus({
        type: "success",
        text: "Check your inbox for a password reset link.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        text: "Couldn't find an account with that email.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <span className="eyebrow">Admin</span>
        <h1>Reset password</h1>
        <p className="admin-auth-sub">
          Enter the email on your admin account and we'll send a reset link.
        </p>

        {status.text && (
          <div className={status.type === "error" ? "form-error" : "form-success"}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary admin-auth-submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="admin-auth-links">
          <Link to="/admin/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}