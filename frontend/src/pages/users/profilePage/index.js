import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './style.scss';

const ProfilePage = () => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className="profile-page">
            <motion.div 
                className="profile-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="cover-photo">
                    <img src="/images/default-cover.jpg" alt="Cover" />
                </div>
                <div className="profile-info">
                    <motion.div 
                        className="profile-photo"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <img src="/images/default-avatar.png" alt="Profile" />
                    </motion.div>
                    <div className="profile-details">
                        <h1>User Name</h1>
                        <p>Bio goes here...</p>
                    </div>
                    <motion.button 
                        className="edit-profile"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Edit Profile
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                ref={ref}
                className="profile-content"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <motion.div className="profile-section" variants={itemVariants}>
                    <h2>About</h2>
                    <div className="about-info">
                        <p>🎓 Studies at University</p>
                        <p>🏠 Lives in City</p>
                        <p>👥 500 friends</p>
                    </div>
                </motion.div>

                <motion.div className="profile-section photos" variants={itemVariants}>
                    <h2>Photos</h2>
                    <div className="photo-grid">
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <motion.div 
                                key={index}
                                className="photo-item"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img src={`/images/photo-${index}.jpg`} alt={`Photo ${index}`} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="profile-section posts" variants={itemVariants}>
                    <h2>Posts</h2>
                    <div className="posts-list">
                        {[1, 2, 3].map((index) => (
                            <motion.div 
                                key={index}
                                className="post-card"
                                whileHover={{ y: -5 }}
                            >
                                <div className="post-header">
                                    <img src="/images/default-avatar.png" alt="User" />
                                    <div>
                                        <h4>User Name</h4>
                                        <span>{index} day ago</span>
                                    </div>
                                </div>
                                <p>Sample post content {index}</p>
                                <div className="post-actions">
                                    <button>👍 Like</button>
                                    <button>💬 Comment</button>
                                    <button>↗️ Share</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;