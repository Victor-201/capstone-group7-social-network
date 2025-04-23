import React, { useState, useEffect, useRef } from 'react';

const Post = ({ post }) => {
  const [reaction, setReaction] = useState({ count: post.reactions, liked: false });
  const [isFocused, setIsFocused] = useState(false);
  const commentInputRef = useRef(null);

  const handleLike = () => {
    setReaction(prev => ({
      count: prev.liked ? prev.count - 1 : prev.count + 1,
      liked: !prev.liked,
    }));
  };

  useEffect(() => {
    const input = commentInputRef.current;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      if (!input.value) setIsFocused(false);
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.author.avatar} alt="Author" className="w-10 h-10 rounded-full" />
          <div>
            <h4 className="font-semibold">{post.author.name}</h4>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {post.time} <i className="fas fa-globe-asia"></i>
            </div>
          </div>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>
      <div className="mt-3">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="mt-3 w-full rounded-lg" />}
      </div>
      <div className="flex justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <i className="fas fa-thumbs-up mr-1"></i>
          <span>{reaction.count}</span>
        </div>
        <div>
          <span>{post.comments} bình luận</span> • <span>{post.shares} lượt chia sẻ</span>
        </div>
      </div>
      <div className="flex justify-between mt-3">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${reaction.liked ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        >
          <i className="far fa-thumbs-up"></i>
          <span>Thích</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <i className="far fa-comment"></i>
          <span>Bình luận</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <i className="far fa-share-square"></i>
          <span>Chia sẻ</span>
        </button>
      </div>
      <div className="mt-4 flex items-center space-x-3">
        <img src="assets/images/avatar-default.jpg" alt="Avatar" className="w-8 h-8 rounded-full" />
        <div className={`flex-1 relative ${isFocused ? 'focused' : ''}`}>
          <input
            ref={commentInputRef}
            type="text"
            placeholder="Viết bình luận..."
            className="w-full p-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2 text-gray-500">
            <i className="far fa-smile"></i>
            <i className="fas fa-camera"></i>
            <i className="fas fa-paperclip"></i>
            <i className="far fa-sticky-note"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;