import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateCart } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = (itemId, change) => {
    const updatedCart = cartItems.map(item => {
      if ((item.part_id === itemId)) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item =>
      !(item.part_id === itemId)
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemName = (item) => {
    return item.part_name;
  };

  const getItemId = (item) => {
    return item.part_id;
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">Your Cart is Empty</h2>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent relative">
          Shopping Cart
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full"></div>
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {cartItems.map((item) => {
          const itemId = getItemId(item);
          const itemName = getItemName(item);

          return (
            <div
              key={itemId}
              className="flex items-center border-b border-gray-100 p-6 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-24 h-24 flex-shrink-0 mr-6">
                <img
                  src={`/images/${item.image_name}`}
                  alt={itemName}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = '/images/default-part.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{itemName}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 shadow-inner">
                  <button
                    onClick={() => handleUpdateQuantity(itemId, -1)}
                    className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(itemId, 1)}
                    className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(itemId)}
                  className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-semibold text-gray-800">Total:</span>
          <span className="text-3xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <Link
            to="/"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 text-center font-medium"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-gray-800 transition-all duration-300 font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
