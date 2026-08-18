import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setStatus({ type: "success", text: "Thanks — we'll reply within a day." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        text: "Couldn't send right now. Please try again shortly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Contact</span>
            <h1>Tell us about your skin.</h1>
            <p>
              Questions about a product, an order, or where to start your
              routine — send us a note and we'll get back to you.
            </p>

            <div className="contact-details">
              <div>
                <span className="eyebrow">Email</span>
                <p>hello@lkmbeauty.com</p>
              </div>
              <div>
                <span className="eyebrow">Studio hours</span>
                <p>Mon – Fri, 9am – 6pm</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {status.text && (
              <div className={status.type === "error" ? "form-error" : "form-success"}>
                {status.text}
              </div>
            )}

            <div className="field">
              <label htmlFor="name">Name</label>
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
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}