import './App.css';
import { CartProvider } from './context/CartContext';
import Navbar from './Component/navbar/navbar';
import Hero from './Component/Hero/Hero';
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


function App() {
  return (
    <CartProvider>
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
    </CartProvider>
  );
}

export default App;