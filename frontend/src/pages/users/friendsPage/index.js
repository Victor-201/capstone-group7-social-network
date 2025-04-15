import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './style.scss';

const FriendsPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const tabs = [
        { id: 'all', label: 'All Friends' },
        { id: 'suggestions', label: 'Suggestions' },
        { id: 'requests', label: 'Friend Requests' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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

    const renderFriendCards = () => {
        const dummyData = Array(12).fill(null).map((_, i) => ({
            id: i,
            name: `Friend ${i + 1}`,
            mutualFriends: Math.floor(Math.random() * 20) + 1
        }));

        return dummyData.map((friend) => (
            <motion.div 
                key={friend.id} 
                className="friend-card"
                variants={itemVariants}
                whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
            >
                <motion.div 
                    className="friend-photo"
                    whileHover={{ scale: 1.1 }}
                >
                    <img src="/images/default-avatar.png" alt={friend.name} />
                </motion.div>
                <div className="friend-info">
                    <h3>{friend.name}</h3>
                    <p>{friend.mutualFriends} mutual friends</p>
                    <div className="friend-actions">
                        <motion.button 
                            className="primary-button"
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeTab === 'suggestions' ? 'Add Friend' : 'Message'}
                        </motion.button>
                        {activeTab === 'suggestions' && (
                            <motion.button 
                                className="secondary-button"
                                whileTap={{ scale: 0.95 }}
                            >
                                Remove
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        ));
    };

    return (
        <div className="friends-page">
            <div className="friends-header">
                <h1>Friends</h1>
                <div className="tabs">
                    {tabs.map(tab => (
                        <motion.button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    ref={ref}
                    className="friends-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    exit={{ opacity: 0 }}
                >
                    {renderFriendCards()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FriendsPage;