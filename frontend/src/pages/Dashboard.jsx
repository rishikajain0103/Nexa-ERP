import { useEffect, useState } from "react";
import { Users, Truck, Package, AlertTriangle, ShoppingCart, ReceiptIndianRupee } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import API from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const companyId = 1;

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await API.get(`/dashboard/summary?company_id=${companyId}`);
      setSummary(res.data);
    } catch (error) {
      console.log("Dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Real-time overview of your business activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`₹${summary?.total_sales || 0}`} subtitle="Revenue generated" icon={<ReceiptIndianRupee size={24} />} />
        <StatCard title="Total Purchase" value={`₹${summary?.total_purchase || 0}`} subtitle="Purchase value" icon={<ShoppingCart size={24} />} />
        <StatCard title="Customers" value={summary?.total_customers || 0} subtitle="Active customers" icon={<Users size={24} />} />
        <StatCard title="Suppliers" value={summary?.total_suppliers || 0} subtitle="Business vendors" icon={<Truck size={24} />} />
        <StatCard title="Products" value={summary?.total_products || 0} subtitle="Inventory items" icon={<Package size={24} />} />
        <StatCard title="Low Stock" value={summary?.low_stock_count || 0} subtitle="Needs attention" icon={<AlertTriangle size={24} />} />
        <StatCard title="Stock Value" value={`₹${summary?.total_stock_value || 0}`} subtitle="Inventory valuation" icon={<Package size={24} />} />
        <StatCard title="Profit Estimate" value={`₹${summary?.profit_estimate || 0}`} subtitle="Sales minus purchase" icon={<ReceiptIndianRupee size={24} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Sales</h2>
          <div className="space-y-3">
            {summary?.recent_sales?.length > 0 ? (
              summary.recent_sales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{sale.invoice_number}</p>
                    <p className="text-sm text-slate-500">Qty: {sale.quantity}</p>
                  </div>
                  <p className="font-bold text-green-600">₹{sale.total_amount}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent sales</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Purchases</h2>
          <div className="space-y-3">
            {summary?.recent_purchases?.length > 0 ? (
              summary.recent_purchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{purchase.bill_number}</p>
                    <p className="text-sm text-slate-500">Qty: {purchase.quantity}</p>
                  </div>
                  <p className="font-bold text-blue-600">₹{purchase.total_amount}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent purchases</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;