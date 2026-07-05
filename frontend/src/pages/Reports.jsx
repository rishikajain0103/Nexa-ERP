import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";
import API from "../services/api";
import { toast } from "react-toastify";

function Reports() {
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [customerLedger, setCustomerLedger] = useState(null);
  const [supplierLedger, setSupplierLedger] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [customerRes, supplierRes] = await Promise.all([
      API.get("/customers/?company_id=1"),
      API.get("/suppliers/?company_id=1"),
    ]);

    setCustomers(customerRes.data);
    setSuppliers(supplierRes.data);
  };

  const viewCustomerLedger = async () => {
    if (!customerId) return;
    const res = await API.get(`/reports/customer-ledger/${customerId}`);
    setCustomerLedger(res.data);
  };

  const viewSupplierLedger = async () => {
    if (!supplierId) return;
    const res = await API.get(`/reports/supplier-ledger/${supplierId}`);
    setSupplierLedger(res.data);
  };

  const download = async (url, filename) => {
    const response = await API.get(url, { responseType: "blob" });
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    toast.success("Report downloaded successfully");
    link.remove();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Reports & Ledgers"
        subtitle="Export business reports and view customer/supplier ledgers"
      />

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <button
          onClick={() => download("/reports/sales/export?company_id=1", "Sales.xlsx")}
          className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 font-semibold shadow"
        >
          Download Sales Excel
        </button>

        <button
          onClick={() => download("/reports/purchases/export?company_id=1", "Purchase.xlsx")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 font-semibold shadow"
        >
          Download Purchase Excel
        </button>

        <button
          onClick={() => download("/reports/stock/export?company_id=1", "Stock.xlsx")}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-5 font-semibold shadow"
        >
          Download Stock Excel
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-xl mb-4">Customer Ledger</h2>

          <div className="flex gap-3">
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="border rounded-xl w-full p-3"
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
            </select>

            <button
              onClick={viewCustomerLedger}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl whitespace-nowrap"
            >
              View
            </button>
          </div>

          {customerLedger && (
            <div className="mt-6 border rounded-2xl overflow-hidden">
              <div className="bg-slate-50 p-4 border-b">
                <p className="font-bold text-slate-900">
                  {customerLedger.customer?.customer_name || "Customer"}
                </p>
                <p className="text-sm text-slate-500">
                  Opening Balance: ₹{customerLedger.opening_balance}
                </p>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Invoice</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {customerLedger.sales?.map((sale) => (
                    <tr key={sale.id} className="border-t">
                      <td className="p-3">{sale.invoice_number}</td>
                      <td className="p-3">{sale.quantity}</td>
                      <td className="p-3 text-right">₹{sale.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-slate-50 p-4 flex justify-between font-bold">
                <span>Closing Balance</span>
                <span>₹{customerLedger.closing_balance}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-xl mb-4">Supplier Ledger</h2>

          <div className="flex gap-3">
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="border rounded-xl w-full p-3"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.supplier_name}
                </option>
              ))}
            </select>

            <button
              onClick={viewSupplierLedger}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl whitespace-nowrap"
            >
              View
            </button>
          </div>

          {supplierLedger && (
            <div className="mt-6 border rounded-2xl overflow-hidden">
              <div className="bg-slate-50 p-4 border-b">
                <p className="font-bold text-slate-900">
                  {supplierLedger.supplier?.supplier_name || "Supplier"}
                </p>
                <p className="text-sm text-slate-500">
                  Opening Balance: ₹{supplierLedger.opening_balance}
                </p>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Bill No</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {supplierLedger.purchases?.map((purchase) => (
                    <tr key={purchase.id} className="border-t">
                      <td className="p-3">{purchase.bill_number}</td>
                      <td className="p-3">{purchase.quantity}</td>
                      <td className="p-3 text-right">₹{purchase.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-slate-50 p-4 flex justify-between font-bold">
                <span>Closing Balance</span>
                <span>₹{supplierLedger.closing_balance}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;