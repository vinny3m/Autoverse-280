import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category';
import RUMService from '../services/RUMService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RUMService.trackPageLoad('Categories');

    const fetchCategories = async () => {
      const startTime = performance.now();
      try {
        const response = await categoryService.getAll();
        const duration = performance.now() - startTime;

        RUMService.trackApiCall('/products/category', duration, 'success');
        setCategories(response.data);
      } catch (error) {
        RUMService.trackApiCall('/products/category', performance.now() - startTime, 'error');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    RUMService.trackInteraction('Categories', 'category_click', { categoryId });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-20 h-20 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Categories
        </h1>
        <p className="text-xl text-gray-600 font-light">Browse our wide selection of automotive parts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div 
            key={category.category_id}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1"
          >
            <Link
              onClick={() => handleCategoryClick(category.category_id)}
              to={`/products/category/${category.category_id}`}
              className="block p-8"
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center group-hover:from-gray-800 group-hover:to-gray-950 transition-all duration-300">
                  <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {category.category_name}
                  </h2>
                  <p className="text-gray-600 text-lg">Explore our {category.category_name.toLowerCase()} collection</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;