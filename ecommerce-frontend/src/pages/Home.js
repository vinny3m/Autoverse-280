import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const categories = ['Category'];

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/trending-products');
        setTrendingProducts(response.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="relative inline-block">
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent relative">
            Welcome to AutoVerse
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full"></div>
          </h1>
        </div>
        <p className="text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mt-8">
          Your premium destination for quality car parts
        </p>
      </div>

      {/* Categories Section */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Categories</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full"></div>
          </div>
          <Link
            to="/category"
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center space-x-2"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category}
              to="/category"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">{category}</h2>
                    <p className="text-gray-600 text-lg">Browse our selection of {category.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Products Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Trending Products</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full"></div>
          </div>
          <Link
            to="/products"
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center space-x-2"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <div 
              key={product.part_id} 
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1 max-w-sm mx-auto w-full"
            >
              {product.image_name && (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={`/images/${product.image_name}`}
                    alt={product.part_name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg border border-gray-100 transform group-hover:scale-105 transition-transform duration-300">
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-semibold">
                      {product.total_quantity} Orders
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300 line-clamp-1">
                  {product.part_name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium italic">Including all taxes</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2 shadow-md text-sm relative overflow-hidden group">
                    <span className="relative z-10">View Details</span>
                    <svg className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
