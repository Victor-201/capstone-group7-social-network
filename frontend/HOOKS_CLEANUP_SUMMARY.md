# Hooks Structure - Final Clean Version

## 📁 Cấu trúc sau khi xóa files cũ:

```
src/hooks/
│
├── auth/                    # 🔐 Authentication hooks
│   ├── useLogin.js         # Login functionality
│   ├── useRegister.js      # User registration  
│   ├── useLogout.js        # Logout with API call
│   ├── useForgotPassword.js# Password recovery
│   └── index.js            # Export auth hooks
│
├── user/                    # 👤 User management hooks
│   ├── useUserInfo.js      # Get user information
│   ├── useOnlineStatus.js  # Track online status
│   ├── useUserActions.js   # Update user info, change password
│   └── index.js            # Export user hooks
│
├── posts/                   # 📝 Post management hooks
│   ├── usePosts.js         # Get posts (newsfeed, user posts, etc.)
│   ├── useCreatePost.js    # Create posts with media upload
│   ├── usePostActions.js   # Update, delete posts
│   ├── usePostLikes.js     # Handle post likes
│   └── index.js            # Export post hooks
│
├── friends/                 # 👥 Friend system hooks
│   ├── useFriends.js       # Get friends list
│   ├── useFriendRequests.js# Handle friend requests
│   ├── useFriendActions.js # Send, accept, reject requests
│   └── index.js            # Export friend hooks
│
├── search/                  # 🔍 Search functionality
│   ├── useSearch.js        # Global search
│   ├── useSearchHistory.js # Search history
│   └── index.js            # Export search hooks
│
├── chat/                    # 💬 Chat & messaging
│   ├── useChat.js          # Chat management
│   ├── useChatMessages.js  # Message handling
│   ├── useChatActions.js   # Chat actions
│   └── index.js            # Export chat hooks
│
├── notifications/           # 🔔 Notification system
│   ├── useNotifications.js # Get notifications
│   ├── useNotificationActions.js # Mark read, delete
│   └── index.js            # Export notification hooks
│
├── useClickOutside.js      # 🖱️  Legacy: Click outside detection
├── useCloudinaryFile.js    # ☁️  Legacy: Cloudinary file upload
├── useLogout.js           # 🚪 Legacy: Simple logout (no API)
├── useTimeAgo.js          # ⏰ Legacy: Time formatting
│
└── index.js               # 📦 Main export file (all hooks)
```

## 🗑️ Files đã xóa:

- ❌ `useAuth.js` → Moved to `auth/` directory
- ❌ `useFriend.js` → Moved to `friends/` directory  
- ❌ `usePost.js` → Moved to `posts/` directory
- ❌ `useComment.js` → Integrated into `posts/` hooks
- ❌ `useLike.js` → Moved to `posts/usePostLikes.js`
- ❌ `useNotification.js` → Moved to `notifications/` directory
- ❌ `useNotifications.js` → Moved to `notifications/` directory
- ❌ `useSearch.js` → Moved to `search/` directory
- ❌ `useUserInfo.js` → Moved to `user/` directory

## 🎯 Benefits sau khi cleanup:

1. **Organized Structure**: Hooks được tổ chức rõ ràng theo category
2. **No Duplication**: Xóa bỏ các file duplicate và cũ
3. **Clear Imports**: Import paths rõ ràng và consistent
4. **Maintainable**: Dễ maintain và extend
5. **Backward Compatible**: Giữ lại legacy hooks cần thiết

## 📝 Import Examples:

```javascript
// Import from specific category
import { useLogin, useRegister } from 'hooks/auth';
import { useUserInfo, useOnlineStatus } from 'hooks/user';
import { usePosts, useCreatePost } from 'hooks/posts';

// Import from main index
import { 
    useLogin, 
    useUserInfo, 
    usePosts,
    useFriends,
    useSearch 
} from 'hooks';

// Legacy hooks still available
import { useClickOutside, useTimeAgo } from 'hooks';
```

## ✅ Clean-up Summary:

- **Before**: 15+ scattered hook files
- **After**: 7 organized directories + 4 legacy files
- **Deleted**: 9 redundant files
- **Total hooks available**: 25+ hooks across all categories
- **Structure**: Clean, organized, maintainable

Ready for production! 🚀
