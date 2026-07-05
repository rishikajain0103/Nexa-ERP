import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    product_code: "",
    purchase_price: 0,
    selling_price: 0,
    gst_percentage: 0,
    opening_stock: 0,
    minimum_stock: 0,
    description: "",
    status: "Active",
    category_id: 1,
    unit_id: 1,
    company_id: 1,
  });

  const fetchItems = async () => {
    try {
      const res = await API.get("/stock-items/?company_id=1");
      setItems(res.data);
    } catch (error) {
      console.log("Failed to load inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createItem = async (e) => {
    e.preventDefault();

    try {
      await API.post("/stock-items/", {
        ...form,
        purchase_price: Number(form.purchase_price),
        selling_price: Number(form.selling_price),
        gst_percentage: Number(form.gst_percentage),
        opening_stock: Number(form.opening_stock),
        minimum_stock: Number(form.minimum_stock),
        category_id: Number(form.category_id),
        unit_id: Number(form.unit_id),
        company_id: 1,
      });

      alert("Stock item created successfully");
      setShowModal(false);

      setForm({
        product_name: "",
        product_code: "",
        purchase_price: 0,
        selling_price: 0,
        gst_percentage: 0,
        opening_stock: 0,
        minimum_stock: 0,
        description: "",
        status: "Active",
        category_id: 1,
        unit_id: 1,
        company_id: 1,
      });

      fetchItems();
    } catch (error) {
      alert("Failed to create stock item. Product code may already exist.");
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this stock item?")) return;

    try {
      await API.delete(`/stock-items/${id}`);
      alert("Stock item deleted successfully");
      fetchItems();
    } catch (error) {
      alert("Failed to delete stock item");
    }
  };

  const columns = [
    { key: "product_name", label: "Product" },
    { key: "product_code", label: "Code" },
    { key: "current_stock", label: "Stock" },
    { key: "minimum_stock", label: "Min Stock" },
    { key: "purchase_price", label: "Purchase ₹" },
    { key: "selling_price", label: "Selling ₹" },
    { key: "status", label: "Status" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory"
        subtitle="Manage stock items, pricing and low-stock levels"
        buttonText="+ Add Stock Item"
        onButtonClick={() => setShowModal(true)}
      />

      {loading ? (
        <Loading text="Loading inventory..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No stock items found"
          message="Add your first product to start managing inventory."
        />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          actions={(row) => (
            <div className="flex justify-end gap-2">
              {row.current_stock <= row.minimum_stock && (
                <span className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold">
                  Low Stock
                </span>
              )}

              <button
                onClick={() => deleteItem(row.id)}
                className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        />
      )}

      {showModal && (
        <Modal title="Add Stock Item" onClose={() => setShowModal(false)}>
          <form
            onSubmit={createItem}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              placeholder="Product Name"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="product_code"
              value={form.product_code}
              onChange={handleChange}
              placeholder="Product Code / SKU"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="purchase_price"
              value={form.purchase_price}
              onChange={handleChange}
              type="number"
              placeholder="Purchase Price"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="selling_price"
              value={form.selling_price}
              onChange={handleChange}
              type="number"
              placeholder="Selling Price"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="gst_percentage"
              value={form.gst_percentage}
              onChange={handleChange}
              type="number"
              placeholder="GST %"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="opening_stock"
              value={form.opening_stock}
              onChange={handleChange}
              type="number"
              placeholder="Opening Stock"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="minimum_stock"
              value={form.minimum_stock}
              onChange={handleChange}
              type="number"
              placeholder="Minimum Stock"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <input
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              type="number"
              placeholder="Category ID"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="unit_id"
              value={form.unit_id}
              onChange={handleChange}
              type="number"
              placeholder="Unit ID"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="md:col-span-2 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 rounded-xl border text-slate-600"
              >
                Cancel
              </button>

              <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold">
                Save Stock Item
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default Inventory;