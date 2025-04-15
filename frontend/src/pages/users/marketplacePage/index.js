import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './style.scss';

const MarketplacePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    const categories = [
        { id: 'all', name: 'All Items' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'furniture', name: 'Furniture' },
        { id: 'clothing', name: 'Clothing' },
        { id: 'vehicles', name: 'Vehicles' }
    ];

    const products = Array(12).fill(null).map((_, i) => ({
        id: i,
        title: `Product ${i + 1}`,
        price: `$${Math.floor(Math.random() * 1000) + 99}`,
        location: 'City Name',
        image: `/images/product-${i + 1}.jpg`,
        seller: `Seller ${i + 1}`,
        postedTime: '2 days ago'
    }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="marketplace-page">
            <div className="marketplace-header">
                <div className="header-content">
                    <h1>Marketplace</h1>
                    <motion.button 
                        className="sell-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        + Sell Something
                    </motion.button>
                </div>
                <div className="categories-scroll">
                    <div className="categories">
                        {categories.map(category => (
                            <motion.button
                                key={category.id}
                                className={`category ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category.name}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedCategory}
                    ref={ref}
                    className="products-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    exit={{ opacity: 0 }}
                >
                    {products.map(product => (
                        <motion.div
                            key={product.id}
                            className="product-card"
                            variants={itemVariants}
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                            }}
                        >
                            <div className="product-image">
                                <img src={product.image} alt={product.title} />
                                <motion.button 
                                    className="save-button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    ❤️
                                </motion.button>
                            </div>
                            <div className="product-info">
                                <h3>{product.title}</h3>
                                <p className="price">{product.price}</p>
                                <p className="location">{product.location}</p>
                                <div className="seller-info">
                                    <span>{product.seller}</span>
                                    <span>•</span>
                                    <span>{product.postedTime}</span>
                                </div>
                            </div>
                            <motion.button 
                                className="contact-button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Contact Seller
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MarketplacePage;