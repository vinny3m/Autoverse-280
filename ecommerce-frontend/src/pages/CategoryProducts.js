import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/products';
import { Link } from 'react-router-dom';

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await productService.getByCategory(categoryId);
        setProducts(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);

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
            Category Products
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full"></div>
          </h1>
        </div>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mt-8">
          Browse our selection of high-quality automotive parts
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.product_id}
            to={`/parts/product/${product.product_id}`}
            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 text-center">
                {product.product_name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;