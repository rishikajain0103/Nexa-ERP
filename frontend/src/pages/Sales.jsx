import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    invoice_number: "",
    customer_id: "",
    stock_item_id: "",
    quantity: 1,
    selling_price: 0,
    company_id: 1,
  });

  const fetchData = async () => {
    try {
      const [salesRes, customerRes, itemRes] = await Promise.all([
        API.get("/sales/?company_id=1"),
        API.get("/customers/?company_id=1"),
        API.get("/stock-items/?company_id=1"),
      ]);

      setSales(salesRes.data);
      setCustomers(customerRes.data);
      setItems(itemRes.data);
    } catch (error) {
      console.log("Sales page error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    const nextNumber = sales.length + 1;

    setForm({
      invoice_number: `INV-${String(nextNumber).padStart(4, "0")}`,
      customer_id: customers[0]?.id || "",
      stock_item_id: items[0]?.id || "",
      quantity: 1,
      selling_price: items[0]?.selling_price || 0,
      company_id: 1,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stock_item_id") {
      const selectedItem = items.find((item) => item.id === Number(value));

      setForm({
        ...form,
        stock_item_id: value,
        selling_price: selectedItem?.selling_price || 0,
      });

      return;
    }

    setForm({ ...form, [name]: value });
  };

  const createSale = async (e) => {
    e.preventDefault();

    try {
      await API.post("/sales/", {
        invoice_number: form.invoice_number,
        customer_id: Number(form.customer_id),
        stock_item_id: Number(form.stock_item_id),
        quantity: Number(form.quantity),
        selling_price: Number(form.selling_price),
        company_id: 1,
      });
      toast.success("Sales voucher created successfully");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create sales voucher. Please check stock availability.");
    }
  };

  const downloadInvoice = async (saleId, invoiceNumber) => {
    try {
      const response = await API.get(`/sales/${saleId}/invoice`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success("Invoice downloaded successfully");
      link.remove();
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const getCustomerName = (id) => {
    return customers.find((customer) => customer.id === id)?.customer_name || `Customer #${id}`;
  };

  const getItemName = (id) => {
    return items.find((item) => item.id === id)?.product_name || `Product #${id}`;
  };

  const tableData = sales.map((sale) => ({
    ...sale,
    customer_name: getCustomerName(sale.customer_id),
    product_name: getItemName(sale.stock_item_id),
  }));

  const columns = [
    { key: "invoice_number", label: "Invoice No" },
    { key: "customer_name", label: "Customer" },
    { key: "product_name", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "selling_price", label: "Rate ₹" },
    { key: "total_amount", label: "Total ₹" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Sales Voucher"
        subtitle="Create sales invoices, reduce stock and download PDF bills"
        buttonText="+ New Sale"
        onButtonClick={openModal}
      />

      {loading ? (
        <Loading text="Loading sales..." />
      ) : sales.length === 0 ? (
        <EmptyState
          title="No sales vouchers found"
          message="Create your first sales voucher to generate invoices."
        />
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          actions={(row) => (
            <button
              onClick={() => downloadInvoice(row.id, row.invoice_number)}
              className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
            >
              PDF
            </button>
          )}
        />
      )}

      {showModal && (
        <Modal title="Create Sales Voucher" onClose={() => setShowModal(false)}>
          <form onSubmit={createSale} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="invoice_number"
              value={form.invoice_number}
              onChange={handleChange}
              placeholder="Invoice Number"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              required
            />

            <select
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customer_name}
                </option>
              ))}
            </select>

            <select
              name="stock_item_id"
              value={form.stock_item_id}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product_name} — Stock: {item.current_stock}
                </option>
              ))}
            </select>

            <input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
              min="1"
              placeholder="Quantity"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="selling_price"
              value={form.selling_price}
              onChange={handleChange}
              type="number"
              placeholder="Selling Price"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="bg-slate-50 rounded-xl px-4 py-3 border">
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-xl font-bold text-slate-900">
                ₹{Number(form.quantity) * Number(form.selling_price)}
              </p>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 rounded-xl border text-slate-600"
              >
                Cancel
              </button>

              <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold">
                Save Sale
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default Sales;