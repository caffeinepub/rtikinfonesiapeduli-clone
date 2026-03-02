import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
// Page imports
import Beranda from "./pages/Beranda";
import PenerimaBantuan from "./pages/PenerimaBantuan";
import PetaBencana from "./pages/PetaBencana";
import Publikasi from "./pages/Publikasi";
import RekapData from "./pages/RekapData";
import Tanggapi from "./pages/Tanggapi";
import Validasi from "./pages/Validasi";

// Root layout route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

// Routes
const berandaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Beranda,
});

const petaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/peta",
  component: PetaBencana,
});

const tanggapiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tanggapi",
  component: Tanggapi,
});

const publikasiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publikasi",
  component: Publikasi,
});

const penerimaBantuanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/penerima-bantuan",
  component: PenerimaBantuan,
});

const rekapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rekap",
  component: RekapData,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLogin,
});

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-panel",
  component: AdminPanel,
});

const validasiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/validasi",
  component: Validasi,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  berandaRoute,
  petaRoute,
  tanggapiRoute,
  publikasiRoute,
  penerimaBantuanRoute,
  rekapRoute,
  adminLoginRoute,
  adminPanelRoute,
  validasiRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register router for TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
