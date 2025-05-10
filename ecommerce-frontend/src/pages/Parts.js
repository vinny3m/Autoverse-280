import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { cartService } from '../services/cart';
import { useCart } from '../context/CartContext';
import { partService } from '../services/parts';
import RUMService from '../services/RUMService';

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();
  const { cartItems, updateCart } = useCart();

  useEffect(() => {
    RUMService.trackPageLoad('Parts');

    const fetchPartsByProduct = async () => {
      try {
        const response = await partService.getByProduct(productId);
        setParts(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartsByProduct();
  }, [productId]);

  const handleAddToCart = (part) => {
    const partWithQuantity = { ...part, quantity: 1 };
    const updatedCart = cartService.addToCart(partWithQuantity);
    updateCart(updatedCart);
  };

  const handleUpdateQuantity = (part, change) => {
    const currentQuantity = getItemQuantity(part.part_id);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      const updatedCart = cartService.removeFromCart(part.part_id);
      updateCart(updatedCart);
      return;
    }

    const updatedCart = cartService.updateQuantity(part.part_id, newQuantity);
    updateCart(updatedCart);
  };

  const getItemQuantity = (partId) => {
    const cartItem = cartItems.find(item => item.part_id === partId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="relative inline-block">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent relative">
            Product Parts
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full"></div>
          </h1>
        </div>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mt-8">
          Browse our selection of high-quality parts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {parts.map((part) => {
          const quantity = getItemQuantity(part.part_id);
          return (
            <div 
              key={part.part_id} 
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1 max-w-sm mx-auto w-full"
            >
              {/* Image Container */}
              <div className="relative pt-[75%] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <img
                  src={`/images/${part.image_name}`}
                  alt={part.part_name}
                  className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/images/parts/default-part.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-medium shadow-md">
                  ${part.price}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4 bg-gradient-to-br from-white to-gray-50">
                <h2 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-1">
                  {part.part_name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {part.description}
                </p>

                {/* Cart Controls */}
                <div className="flex flex-col gap-2">
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(part)}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-2 rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5 shadow-inner">
                      <button
                        onClick={() => handleUpdateQuantity(part, -1)}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-1.5 rounded-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium mx-2 text-gray-800">{quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(part, 1)}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-1.5 rounded-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Parts;