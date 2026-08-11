import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import type { RootState } from "../store/store";
import { logoutUser } from "../api/userService";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";

function Navbar() {
  const [opacity, setOpacity] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    function handleScroll() {
      const maxScroll = 75;
      const scroll = window.scrollY;
      if (scroll > maxScroll) {
        setOpacity(1);
      } else {
        setOpacity(scroll / maxScroll);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Ignore network error on logout
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }

  return (
    <div
      className="fixed w-full z-50 transition-colors duration-200"
      style={{
        background: `rgba(16,24,40,${opacity})`,
        borderBottom: `2px solid rgba(30,41,57,${opacity})`,
      }}
    >
      <div className="flex items-center justify-between py-4 px-4 lg:px-10">
        <Link to="/dashboard" className="matemasie text-white/90 text-2xl lg:text-3xl">
          SMOL
        </Link>
        {isAuthenticated && user && (
          <div className="flex items-center gap-4 text-white/80">
            <span className="hidden sm:inline text-xl patrick-hand tracking-wider">
              Hi, <span className="text-white font-bold">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-lg patrick-hand tracking-wider cursor-pointer duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
