import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail"));
const PackageDetail = lazy(() => import("./pages/PackageDetail"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const Shopping = lazy(() => import("./pages/Shopping"));
const ShopDetail = lazy(() => import("./pages/ShopDetail"));
const Tours = lazy(() => import("./pages/Tours"));
const Chat = lazy(() => import("./pages/Chat"));
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function SiteLoader() {
  return (
    <div className="site-loader" role="status" aria-live="polite">
      <div className="site-loader-card">
        <div className="site-loader-brand">Ceylon Explore</div>
        <div className="site-loader-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? children : <Navigate to="/" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <SiteLoader />;
  }

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<SiteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/destinations" element={<ProtectedRoute><Destinations /></ProtectedRoute>} />
            <Route path="/destinations/packages/:slug" element={<ProtectedRoute><PackageDetail /></ProtectedRoute>} />
            <Route path="/destinations/:id" element={<ProtectedRoute><DestinationDetail /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/plan-trip" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/shopping/:shopId" element={<ShopDetail />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
