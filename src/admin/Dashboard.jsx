import { useEffect, useState } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../firebase/products";
import "./Dashboard.css";

const emptyForm = { name: "", category: "Serum", price: "", description: "", image: "" };
const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Makeup"];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(
        "Couldn't load products. Check that Firebase is configured (see .env)."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(product) {
    setForm({
      name: product.name || "",
      category: product.category || "Serum",
      price: product.price ?? "",
      description: product.description || "",
      image: product.image || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: form.price === "" ? null : Number(form.price),
      image: form.image.trim(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }
      cancelForm();
      loadProducts();
    } catch (err) {
      setError("Couldn't save the product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Couldn't delete the product. Please try again.");
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>Products &amp; services</h1>
        </div>
        <button className="btn btn-primary" onClick={startAdd}>
          + Add product
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit product" : "New product"}</h2>

          <div className="form-row">
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
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="price">Price (USD)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="text"
              placeholder="/products/serum4.jpg or https://..."
              value={form.image}
              onChange={handleChange}
            />
            <span className="field-hint">
              Use a path like /products/photo.jpg for images you put in the
              project's public/products folder, or paste a full image link.
            </span>
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
            </button>
            <button type="button" className="btn btn-outline" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="dashboard-table-wrap">
        {loading ? (
          <p className="dashboard-empty">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="dashboard-empty">
            No products yet. Add your first one above.
          </p>
        ) : (
          categories
            .map((category) => ({
              category,
              items: products.filter((p) => p.category === category),
            }))
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <div className="dashboard-category-group" key={group.category}>
                <div className="dashboard-category-head">
                  <h2>{group.category}</h2>
                  <span className="dashboard-category-count">
                    {group.items.length}
                  </span>
                </div>

                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th aria-label="Image" />
                      <th>Name</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((p) => (
                      <tr key={p.id}>
                        <td className="dashboard-thumb-cell">
                          {p.image ? (
                            <img src={p.image} alt="" className="dashboard-thumb" />
                          ) : (
                            <div className="dashboard-thumb dashboard-thumb-empty" />
                          )}
                        </td>
                        <td>{p.name}</td>
                        <td>{p.price != null ? `$${p.price}` : "—"}</td>
                        <td className="dashboard-desc">{p.description}</td>
                        <td className="dashboard-actions">
                          <button className="link-btn" onClick={() => startEdit(p)}>
                            Edit
                          </button>
                          <button
                            className="link-btn link-btn-danger"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
        )}
      </div>
    </div>
  );
}