import React from 'react';
import './style.scss';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="left-sidebar">
                <nav className="menu-list">
                    <a href="/profile" className="menu-item">
                        <div className="avatar">
                            <img src="/default-avatar.png" alt="Profile" />
                        </div>
                        <span>Your Profile</span>
                    </a>
                    <a href="/friends" className="menu-item">
                        <span className="icon">👥</span>
                        <span>Friends</span>
                    </a>
                    <a href="/saved" className="menu-item">
                        <span className="icon">🔖</span>
                        <span>Saved</span>
                    </a>
                    <a href="/memories" className="menu-item">
                        <span className="icon">⏰</span>
                        <span>Memories</span>
                    </a>
                    <a href="/groups" className="menu-item">
                        <span className="icon">👥</span>
                        <span>Groups</span>
                    </a>
                </nav>
            </div>
            
            <main className="main-content">
                <div className="create-post">
                    <div className="post-input">
                        <img src="/default-avatar.png" alt="Profile" />
                        <input type="text" placeholder="What's on your mind?" />
                    </div>
                    <div className="post-actions">
                        <button className="action-button">
                            <span className="icon">📷</span>
                            Photo/Video
                        </button>
                        <button className="action-button">
                            <span className="icon">😊</span>
                            Feeling/Activity
                        </button>
                    </div>
                </div>

                <div className="feed">
                    {/* Sample post */}
                    <div className="post">
                        <div className="post-header">
                            <img src="/default-avatar.png" alt="User" />
                            <div className="post-info">
                                <h4>John Doe</h4>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                        <div className="post-content">
                            <p>Hello everyone! This is my first post.</p>
                        </div>
                        <div className="post-actions">
                            <button>👍 Like</button>
                            <button>💬 Comment</button>
                            <button>↗️ Share</button>
                        </div>
                    </div>
                </div>
            </main>

            <div className="right-sidebar">
                <div className="contacts-header">
                    <h3>Contacts</h3>
                </div>
                <div className="contacts-list">
                    <div className="contact">
                        <img src="/default-avatar.png" alt="Contact" />
                        <span>Jane Smith</span>
                    </div>
                    <div className="contact">
                        <img src="/default-avatar.png" alt="Contact" />
                        <span>Mike Johnson</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;