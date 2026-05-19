import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;