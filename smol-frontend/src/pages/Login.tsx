import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser } from "../api/userService";
import { setCredentials } from "../store/authSlice";
import type { RootState } from "../store/store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      if (response.success && response.data) {
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          })
        );
        toast.success(response.message || "Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to log in");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(typeof msg === "string" ? msg : msg[0]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center patrick-hand tracking-wider px-3 py-10">
      <div className="bg-gray-800 flex flex-col gap-4 text-white/80 p-8 sm:p-10 rounded-xl border-1 border-gray-700 w-full max-w-md">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center pb-2">
          Log into your account to use <span className="matemasie text-white">SMOL</span>
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="pl-2 text-xl">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border-1 border-gray-500 w-full rounded-lg bg-gray-600/10 text-white focus:outline-none focus:border-gray-400 text-lg"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="pl-2 text-xl">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border-1 border-gray-500 w-full rounded-lg bg-gray-600/10 text-white focus:outline-none focus:border-gray-400 text-lg"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="text-2xl bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg my-2 duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-xl text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
