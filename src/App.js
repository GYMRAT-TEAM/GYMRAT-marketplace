import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

// Components
import Navbar from './Component/navbar/navbar';
import Hero from './Component/Hero/Hero';
import SignIn from './Component/SignIn/SignIn';
import SignUp from './Component/SignIn/SignUp';
import AppSection from './AppSection/AppSection';
import Footer from './Component/Footer/Footer';
import CreateAccount from './Component/SignIn/CreateAccount';
import CheckoutModal from './Component/Checkout/CheckoutModal';
import PaymentPlan from './Component/PaymentPlan/PaymentPlan';

// Admin Components
import AdminLayout from './Component/AdminPanel/AdminLayout';
import AdminDashboard from './Component/AdminPanel/AdminDashboard';
import AdminProducts from './Component/AdminPanel/AdminProducts';
import AdminTransactions from './Component/AdminPanel/AdminTransactions';
import AdminPlaceholder from './Component/AdminPanel/AdminPlaceholder';

// Pages
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Wellness from './pages/Wellness';
import Blog from './pages/Blog';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import SportShop from './pages/SportShop';

function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="MainLayout">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      {isCartOpen && <CheckoutModal onClose={() => setIsCartOpen(false)} />}

      <Hero />
      <Shop />
      <Categories />
      <Products />
      <Brands />
      <Blog />
      <Community />
      <Analytics />
      <Wellness />
      <AppSection />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  // ── In Create React App, env vars must start with REACT_APP_
  // ── Add this to your frontend/.env file:
  // ── REACT_APP_GOOGLE_CLIENT_ID=705716140221-fppisteno8o1b772cqa6a49lv8pdcvus.apps.googleusercontent.com
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '705716140221-fppisteno8o1b772cqa6a49lv8pdcvus.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <Routes>
                {/* Main homepage layout */}
                <Route path="/" element={<MainLayout />} />

                {/* Auth */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/payment" element={<PaymentPlan />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/shop/:sport" element={<SportShop />} />

                {/* Admin Panel */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="finance/transactions" element={<AdminTransactions />} />
                  <Route path="*" element={<AdminPlaceholder />} />
                </Route>
              </Routes>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;