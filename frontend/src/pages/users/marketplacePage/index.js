import React from 'react';
import Header from '../../../components/Header';
import DarkModeToggle from '../../../components/DarkModeToggle';
import './style.scss';

// Mock data cho Marketplace
const marketplaceData = {
  categories: [
    { id: 1, name: 'Đồ điện tử', icon: 'fas fa-laptop' },
    { id: 2, name: 'Ô tô', icon: 'fas fa-car' },
    { id: 3, name: 'Đồ gia dụng', icon: 'fas fa-couch' },
    { id: 4, name: 'Thời trang', icon: 'fas fa-tshirt' },
  ],
  products: [
    {
      id: 1,
      title: 'iPhone 14 Pro',
      price: '25.000.000 VNĐ',
      image: 'assets/images/avatar-default.jpg',
      location: 'Hà Nội',
      time: '2 giờ trước',
    },
    {
      id: 2,
      title: 'Xe máy Honda Wave',
      price: '15.000.000 VNĐ',
      image: 'assets/images/avatar-default.jpg',
      location: 'TP. Hồ Chí Minh',
      time: '1 ngày trước',
    },
    {
      id: 3,
      title: 'Áo thun nam',
      price: '150.000 VNĐ',
      image: 'assets/images/avatar-default.jpg',
      location: 'Đà Nẵng',
      time: '3 giờ trước',
    },
  ],
};

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />
      <DarkModeToggle />
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Marketplace</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {marketplaceData.categories.map(category => (
              <button
                key={category.id}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow"
              >
                <i className={`${category.icon} text-blue-600`}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Sản phẩm nổi bật</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketplaceData.products.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold">{product.title}</h4>
                <p className="text-blue-600 font-semibold">{product.price}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{product.location}</span>
                  <span>{product.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;