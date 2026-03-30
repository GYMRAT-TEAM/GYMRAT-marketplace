import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './Component/navbar/navbar';
import Hero from './Component/Hero/Hero';
import SignIn from './Component/SignIn/SignIn';
import AppSection from './AppSection/AppSection';
import Footer from './Component/Footer/Footer';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Wellness from './pages/Wellness';
import Blog from './pages/Blog';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import Contact from './pages/Contact';
import SignUp from './Component/SignIn/SignUp';

function MainLayout() {
  return (
    <>
      <Navbar />
      <Hero />
      <Shop />
      <Categories />
      <Products />
      <Brands />
      <Wellness />
      <Blog />
      <Community />
      <Analytics />
      <AppSection />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;