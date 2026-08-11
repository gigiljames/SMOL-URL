import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-900">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
