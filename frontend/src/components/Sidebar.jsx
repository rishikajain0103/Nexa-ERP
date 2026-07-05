import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Suppliers", path: "/suppliers", icon: Truck },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Purchase", path: "/purchase", icon: ShoppingCart },
  { name: "Sales", path: "/sales", icon: Receipt },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

function Sidebar() {
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("nexa_token");
    localStorage.removeItem("nexa_user");
    window.location.href = "/";
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-lg">
            N
          </div>
          <div>
            <h1 className="text-xl font-bold">Nexa ERP</h1>
            <p className="text-xs text-slate-400">Business Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-blue-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500 hover:text-white transition"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;