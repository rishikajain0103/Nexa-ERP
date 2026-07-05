import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    bill_number: "",
    supplier_id: "",
    stock_item_id: "",
    quantity: 1,
    purchase_price: 0,
    company_id: 1,
  });

  const fetchData = async () => {
    try {
      const [purchaseRes, supplierRes, itemRes] = await Promise.all([
        API.get("/purchases/?company_id=1"),
        API.get("/suppliers/?company_id=1"),
        API.get("/stock-items/?company_id=1"),
      ]);

      setPurchases(purchaseRes.data);
      setSuppliers(supplierRes.data);
      setItems(itemRes.data);
    } catch (error) {
      console.log("Purchase page error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    const nextNumber = purchases.length + 1;

    setForm({
      bill_number: `PUR-${String(nextNumber).padStart(4, "0")}`,
      supplier_id: suppliers[0]?.id || "",
      stock_item_id: items[0]?.id || "",
      quantity: 1,
      purchase_price: items[0]?.purchase_price || 0,
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
        purchase_price: selectedItem?.purchase_price || 0,
      });

      return;
    }

    setForm({ ...form, [name]: value });
  };

  const createPurchase = async (e) => {
    e.preventDefault();

    try {
      await API.post("/purchases/", {
        bill_number: form.bill_number,
        supplier_id: Number(form.supplier_id),
        stock_item_id: Number(form.stock_item_id),
        quantity: Number(form.quantity),
        purchase_price: Number(form.purchase_price),
        company_id: 1,
      });
      toast.success("Purchase voucher created successfully");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create purchase voucher");
    }
  };

  const getSupplierName = (id) => {
    return suppliers.find((supplier) => supplier.id === id)?.supplier_name || `Supplier #${id}`;
  };

  const getItemName = (id) => {
    return items.find((item) => item.id === id)?.product_name || `Product #${id}`;
  };

  const tableData = purchases.map((purchase) => ({
    ...purchase,
    supplier_name: getSupplierName(purchase.supplier_id),
    product_name: getItemName(purchase.stock_item_id),
  }));

  const columns = [
    { key: "bill_number", label: "Bill No" },
    { key: "supplier_name", label: "Supplier" },
    { key: "product_name", label: "Product" },
    { key: "quantity", label: "Qty" },
    { key: "purchase_price", label: "Rate ₹" },
    { key: "total_amount", label: "Total ₹" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Purchase Voucher"
        subtitle="Record purchases and automatically increase inventory stock"
        buttonText="+ New Purchase"
        onButtonClick={openModal}
      />

      {loading ? (
        <Loading text="Loading purchases..." />
      ) : purchases.length === 0 ? (
        <EmptyState
          title="No purchase vouchers found"
          message="Create your first purchase voucher to increase product stock."
        />
      ) : (
        <DataTable columns={columns} data={tableData} />
      )}

      {showModal && (
        <Modal title="Create Purchase Voucher" onClose={() => setShowModal(false)}>
          <form onSubmit={createPurchase} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="bill_number"
              value={form.bill_number}
              onChange={handleChange}
              placeholder="Bill Number"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              required
            />

            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
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
              name="purchase_price"
              value={form.purchase_price}
              onChange={handleChange}
              type="number"
              placeholder="Purchase Price"
              className="px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="bg-slate-50 rounded-xl px-4 py-3 border">
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-xl font-bold text-slate-900">
                ₹{Number(form.quantity) * Number(form.purchase_price)}
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
                Save Purchase
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default Purchase;