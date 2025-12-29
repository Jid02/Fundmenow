import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CampaignDetails from "./pages/CampaignDetails.jsx";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import CampaignListPage from "./pages/CampaignListPage.jsx";


const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: logo + main links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-brand-600 font-semibold"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-lg">
                ₹
              </span>
              <span className="text-lg">FundMeNow</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                to="/"
                className="text-slate-700 hover:text-brand-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/campaigns"
                className="text-slate-700 hover:text-brand-600 transition-colors"
              >
                Campaigns
              </Link>
              {user?.role === "creator" && (
                <Link
                  to="/creator/dashboard"
                  className="text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Creator
                </Link>
              )}
              {user?.role === "donor" && (
                <Link
                  to="/donor/dashboard"
                  className="text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Donor
                </Link>
              )}
            </div>
          </div>

          {/* Right: auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-slate-500">
                  Signed in as{" "}
                  <span className="font-medium text-slate-700">
                    {user.name}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-transparent text-slate-700 hover:bg-slate-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-brand-500 text-white hover:bg-brand-600 shadow-sm transition"
                >
                  Start a campaign
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
  <Route path="/campaigns" element={<CampaignListPage />} />
  <Route path="/campaigns/:id" element={<CampaignDetails />} />
  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/creator/dashboard"
          element={
            <PrivateRoute roles={["creator"]}>
              <CreatorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/donor/dashboard"
          element={
            <PrivateRoute roles={["donor"]}>
              <DonorDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}