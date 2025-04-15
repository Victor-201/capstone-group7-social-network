import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './style.scss';

const WatchPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'live', name: 'Live' },
        { id: 'gaming', name: 'Gaming' },
        { id: 'following', name: 'Following' },
        { id: 'saved', name: 'Saved' }
    ];

    const videoData = Array(8).fill(null).map((_, i) => ({
        id: i,
        title: `Video Title ${i + 1}`,
        views: Math.floor(Math.random() * 1000) + 'K views',
        duration: '12:34',
        thumbnail: `/images/video-${i + 1}.jpg`,
        author: `Creator ${i + 1}`,
        avatar: '/images/default-avatar.png'
    }));

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

    return (
        <div className="watch-page">
            <div className="watch-header">
                <h1>Watch</h1>
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

            <motion.div
                ref={ref}
                className="video-grid"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                {videoData.map(video => (
                    <motion.div
                        key={video.id}
                        className="video-card"
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                        }}
                    >
                        <div className="thumbnail">
                            <img src={video.thumbnail} alt={video.title} />
                            <span className="duration">{video.duration}</span>
                            <motion.button 
                                className="play-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ▶️
                            </motion.button>
                        </div>
                        <div className="video-info">
                            <img className="avatar" src={video.avatar} alt={video.author} />
                            <div className="details">
                                <h3>{video.title}</h3>
                                <p className="author">{video.author}</p>
                                <p className="views">{video.views} • 2 days ago</p>
                            </div>
                        </div>
                        <div className="video-actions">
                            <motion.button whileHover={{ scale: 1.1 }}>Save</motion.button>
                            <motion.button whileHover={{ scale: 1.1 }}>Share</motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default WatchPage;