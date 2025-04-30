import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JadwalLatihan from "./pages/JadwalLatihan";
import EditJadwalLatihan from "./pages/EditJadwalLatihan";
import MembersPage from "./pages/MembersPage";
import MemberForm from "./pages/MemberForm";
import MemberManagementPage from "./pages/MemberManagementPage";
import MemberManagementForm from "./pages/MemberManagementForm";
import AdminsPage from "./pages/AdminsPage";
import AdminForm from "./pages/AdminForm";
import AbsensiList from "./pages/AbsensiList";
import AbsensiForm from "./pages/AbsensiForm";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { AuthProvider } from "./utils/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

const ErrorBoundary = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen flex items-center justify-center bg-black"
  >
    <div className="text-center">
      <h1 className="text-2xl font-bold text-emerald-500">Oops! Something went wrong.</h1>
      <p className="mt-2 text-gray-300">Please try again later or contact support.</p>
    </div>
  </motion.div>
);

const queryClient = new QueryClient();
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<BaseLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="members"
            element={
              <PrivateRoute>
                <MembersPage />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="members/new"
            element={
              <PrivateRoute>
                <MemberForm />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="member-management"
            element={
              <PrivateRoute>
                <MemberManagementPage />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="member-management/new"
            element={
              <PrivateRoute>
                <MemberManagementForm />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="member-management/:id"
            element={
              <PrivateRoute>
                <MemberManagementForm />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="admins"
            element={
              <PrivateRoute>
                <AdminsPage />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="admins/new"
            element={
              <PrivateRoute>
                <AdminForm />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="jadwal-latihan"
            element={
              <PrivateRoute>
                <JadwalLatihan />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="jadwal-latihan/edit/:id"
            element={
              <PrivateRoute>
                <EditJadwalLatihan />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="absensi"
            element={
              <PrivateRoute>
                <AbsensiList />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="absensi/new"
            element={
              <PrivateRoute>
                <AbsensiForm />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="absensi/edit/:id"
            element={
              <PrivateRoute>
                <AbsensiForm />
              </PrivateRoute>
            }
            errorElement={<ErrorBoundary />}
          />
        </Route>
      </Route>
    )
  );
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AnimatePresence mode="wait">
            <RouterProvider router={router} />
          </AnimatePresence>
        </QueryClientProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
