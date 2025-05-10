import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Category from './pages/Category';
import CategoryProducts from './pages/CategoryProducts';
import { CartProvider } from './context/CartContext';
import Parts from './pages/Parts';
import OrderConfirmation from './pages/OrderConfirmation';
import Dashboard from './pages/Dashboard';
import Chatbot from './components/ChatBot';

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/products/category/:categoryId" element={<CategoryProducts />} />
            <Route path="/parts/product/:productId" element={<Parts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Chatbot />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
