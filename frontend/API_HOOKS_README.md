# Frontend API và Hooks Structure

## Cấu trúc API Files

Các API được tổ chức theo chức năng, giống với cấu trúc service ở backend:

### API Files

- **`accountApi.js`** - Xử lý authentication (login, register, logout, forgot password, v.v.)
- **`userApi.js`** - Quản lý thông tin user (getUserInfo, updateUserInfo, changePassword, v.v.)
- **`profileApi.js`** - Quản lý profile details và privacy settings
- **`friendApi.js`** - Xử lý tính năng bạn bè (send/accept/reject friend requests, v.v.)
- **`postApi.js`** - Quản lý bài viết (create, read, update, delete posts)
- **`commentApi.js`** - Quản lý comments
- **`likeApi.js`** - Xử lý like/unlike cho posts và comments
- **`followApi.js`** - Xử lý follow/unfollow users
- **`searchApi.js`** - Tìm kiếm users, posts, và global search
- **`chatApi.js`** - Quản lý chat rooms
- **`messageApi.js`** - Xử lý tin nhắn
- **`notificationApi.js`** - Quản lý thông báo

## Cấu trúc Custom Hooks

Tất cả `useState` và `useEffect` được tổ chức trong các custom hooks:

### Hook Files

- **`useAuth.js`** - Hooks cho authentication (useLogin, useRegister, useLogoutAccount)
- **`useUserInfo.js`** - Hook để lấy thông tin user
- **`useFriend.js`** - Hooks cho tính năng bạn bè (useFriends, useFriendRequests, useFriendActions, v.v.)
- **`usePost.js`** - Hooks cho posts (useNewsfeed, useUserPosts, usePost, usePostActions)
- **`useComment.js`** - Hooks cho comments (usePostComments, useComment, useCommentActions)
- **`useLike.js`** - Hooks cho likes (usePostLikes, useCommentLikes, useLikeActions)
- **`useSearch.js`** - Hooks cho search (useSearchUsers, useSearchPosts, useGlobalSearch, v.v.)
- **`useNotification.js`** - Hooks cho notifications (useNotifications, useUnreadNotificationCount, v.v.)

## Cách sử dụng

### Ví dụ sử dụng hook trong component:

```javascript
import { useUserInfo, useFriends, useNewsfeed } from '../hooks';

const ProfilePage = ({ userId }) => {
    // Lấy thông tin user với loading state
    const { userInfo, loading, error } = useUserInfo(userId);
    
    // Lấy danh sách bạn bè
    const { friends, loading: friendsLoading, error: friendsError, refetch } = useFriends(userId);
    
    // Lấy newsfeed
    const { posts, loading: postsLoading, hasMore, loadMore } = useNewsfeed();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{userInfo.name}</h1>
            {/* Render UI */}
        </div>
    );
};
```

### Ví dụ sử dụng actions:

```javascript
import { useFriendActions, usePostActions } from '../hooks';

const SomeComponent = () => {
    const { sendRequest, loading, error } = useFriendActions();
    const { createNewPost, loading: postLoading } = usePostActions();

    const handleSendFriendRequest = async (userId) => {
        try {
            await sendRequest(userId);
            // Success handling
        } catch (err) {
            // Error handling
        }
    };

    const handleCreatePost = async (postData) => {
        try {
            await createNewPost(postData);
            // Success handling
        } catch (err) {
            // Error handling
        }
    };

    return (
        <div>
            {/* UI components */}
        </div>
    );
};
```

## Đặc điểm của cấu trúc mới

1. **Consistent Loading States**: Tất cả hooks đều có `loading` state
2. **Error Handling**: Unified error handling across all hooks
3. **Reusability**: Hooks có thể được tái sử dụng ở nhiều components
4. **Separation of Concerns**: API logic tách biệt với UI logic
5. **Easy to Maintain**: Cấu trúc giống backend để dễ maintain
6. **Optimized Performance**: Sử dụng `useCallback` và `useMemo` để tối ưu
7. **Pagination Support**: Hầu hết hooks hỗ trợ pagination và infinite loading

## Import và Export

### Import từ API:
```javascript
import { getUserInfo, createPost, sendFriendRequest } from '../api';
```

### Import từ Hooks:
```javascript
import { useUserInfo, useNewsfeed, useFriendActions } from '../hooks';
```

## Naming Convention

- **API functions**: camelCase (getUserInfo, createPost, sendFriendRequest)
- **Hook names**: camelCase với prefix "use" (useUserInfo, useNewsfeed)
- **State variables**: camelCase với descriptive names (userInfo, loading, error)
- **Action functions**: descriptive camelCase (sendRequest, createNewPost)
