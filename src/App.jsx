import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { ProductsProvider } from "./context/ProductsContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import OrderDetails from "./pages/OrderDetails";

const App = () => {
  return (
    <Router>
      {/* 1. AdminProvider khassu i-koun hwa l-Parent l-awal bach i-7mi l-session */}
      <AdminProvider>
        <ProductsProvider>
          <CartProvider>
            
            <div className="flex flex-col min-h-screen">
              {/* Navbar west l-Providers bach i-9der i-3ref wach user m-connecti */}
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  {/* --- Public Routes --- */}
                  <Route path="/" element={<Home />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* --- Admin Auth --- */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* --- Protected Admin Routes --- */}
                  {/* Koulchi hna m-7mi b ProtectedRoute */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/products" 
                    element={
                      <ProtectedRoute>
                        <AdminProducts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute>
                        <AdminOrders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders/:id" 
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Redirect ayy route ghlat l-Home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>

          </CartProvider>
        </ProductsProvider>
      </AdminProvider>
    </Router>
  );
};

export default App;