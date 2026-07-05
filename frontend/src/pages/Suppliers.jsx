import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    supplier_name: "",
    mobile_number: "",
    email: "",
    gst_number: "",
    address: "",
    opening_balance: 0,
    company_id: 1,
  });

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers/?company_id=1");
      setSuppliers(res.data);
    } catch (error) {
      console.log("Failed to load suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createSupplier = async (e) => {
    e.preventDefault();

    try {
      await API.post("/suppliers/", {
        ...form,
        opening_balance: Number(form.opening_balance),
        company_id: 1,
      });

      alert("Supplier created successfully");
      setShowModal(false);

      setForm({
        supplier_name: "",
        mobile_number: "",
        email: "",
        gst_number: "",
        address: "",
        opening_balance: 0,
        company_id: 1,
      });

      fetchSuppliers();
    } catch (error) {
      alert("Failed to create supplier");
    }
  };

  const deleteSupplier = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await API.delete(`/suppliers/${id}`);
      alert("Supplier deleted successfully");
      fetchSuppliers();
    } catch (error) {
      alert("Failed to delete supplier");
    }
  };

  const columns = [
    { key: "supplier_name", label: "Supplier Name" },
    { key: "mobile_number", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "gst_number", label: "GST No" },
    { key: "opening_balance", label: "Opening Balance" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Suppliers"
        subtitle="Manage vendors, purchase parties and supplier balances"
        buttonText="+ Add Supplier"
        onButtonClick={() => setShowModal(true)}
      />

      {loading ? (
        <Loading text="Loading suppliers..." />
      ) : suppliers.length === 0 ? (
        <EmptyState
          title="No suppliers found"
          message="Add your first supplier to start recording purchases."
        />
      ) : (
        <DataTable
          columns={columns}
          data={suppliers}
          actions={(row) => (
            <button
              onClick={() => deleteSupplier(row.id)}
              className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
            >
              Delete
            </button>
          )}
        />
      )}

      {showModal && (
        <Modal title="Add New Supplier" onClose={() => setShowModal(false)}>
          <form
            onSubmit={createSupplier}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="supplier_name"
              value={form.supplier_name}
              onChange={handleChange}
              placeholder="Supplier Name"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="gst_number"
              value={form.gst_number}
              onChange={handleChange}
              placeholder="GST Number"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="opening_balance"
              value={form.opening_balance}
              onChange={handleChange}
              type="number"
              placeholder="Opening Balance"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                Save Supplier
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default Suppliers;