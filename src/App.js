
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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

// then inside your JSX:

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
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Main homepage layout */}
          <Route path="/" element={<MainLayout />} />

          {/* Sign In & Sign Up */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/payment" element={<PaymentPlan />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;