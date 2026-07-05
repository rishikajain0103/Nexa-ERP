import { useEffect, useState } from "react";


import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    mobile_number: "",
    email: "",
    gst_number: "",
    address: "",
    opening_balance: 0,
    company_id: 1,
  });

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers/?company_id=1");
      setCustomers(res.data);
    } catch (error) {
      console.log("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createCustomer = async (e) => {
    e.preventDefault();

    try {
      await API.post("/customers/", {
        ...form,
        opening_balance: Number(form.opening_balance),
        company_id: 1,
      });

      alert("Customer created successfully");
      setShowModal(false);

      setForm({
        customer_name: "",
        mobile_number: "",
        email: "",
        gst_number: "",
        address: "",
        opening_balance: 0,
        company_id: 1,
      });

      fetchCustomers();
    } catch (error) {
      alert("Failed to create customer");
    }
  };

  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await API.delete(`/customers/${id}`);
      alert("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      alert("Failed to delete customer");
    }
  };

  const columns = [
    { key: "customer_name", label: "Customer Name" },
    { key: "mobile_number", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "gst_number", label: "GST No" },
    { key: "opening_balance", label: "Opening Balance" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        subtitle="Manage your business customers and outstanding balances"
        buttonText="+ Add Customer"
        onButtonClick={() => setShowModal(true)}
      />

      {loading ? (
        <Loading text="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          message="Add your first customer to start creating sales invoices."
        />
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          actions={(row) => (
            <button
              onClick={() => deleteCustomer(row.id)}
              className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
            >
              Delete
            </button>
          )}
        />
      )}

      {showModal && (
        <Modal title="Add New Customer" onClose={() => setShowModal(false)}>
          <form onSubmit={createCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Customer Name" className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
            <input name="mobile_number" value={form.mobile_number} onChange={handleChange} placeholder="Mobile Number" className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="gst_number" value={form.gst_number} onChange={handleChange} placeholder="GST Number" className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="opening_balance" value={form.opening_balance} onChange={handleChange} type="number" placeholder="Opening Balance" className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 rounded-xl border text-slate-600">
                Cancel
              </button>
              <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold">
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default Customers;