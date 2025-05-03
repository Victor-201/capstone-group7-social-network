import HomePage from './pages/users/homePage';
import PersonalPage from './pages/users/personalPage';
import WatchPage from './pages/users/watchPage';
import MarketplacePage from './pages/users/marketplacePage';
import LoginPage from './pages/users/loginPage';
import RegisterPage from './pages/users/registerPage';
import FriendsPage from './pages/users/friendsPage'; // Import trang Friends
import MasterLayout from './layouts/masterLayout';
import { ROUTERS } from './utils/router';
import { Route, Routes, Navigate } from 'react-router-dom';
import GroupsPage from './pages/users/groupsPage'; // Import trang Groups

// Component bảo vệ route, chỉ cho phép truy cập khi đã đăng nhập
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Component điều hướng khi đã đăng nhập
const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/" />;
  }

  return children;
};

const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      Component: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTERS.USER.FRIENDS,
      Component: (
        <ProtectedRoute>
          <FriendsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTERS.USER.WATCH,
      Component: (
        <ProtectedRoute>
          <WatchPage />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTERS.USER.MARKETPLACE,
      Component: (
        <ProtectedRoute>
          <MarketplacePage />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTERS.USER.GROUPS,
      Component: (
        <ProtectedRoute>
          <GroupsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTERS.USER.USER_PROFILE,
      Component: (
        <ProtectedRoute>
          <PersonalPage />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTERS.AUTH.LOGIN,
      Component: (
        <AuthRedirect>
          <LoginPage />
        </AuthRedirect>
      ),
    },
    {
      path: ROUTERS.AUTH.REGISTER,
      Component: (
        <AuthRedirect>
          <RegisterPage />
        </AuthRedirect>
      ),
    }
  ];

  return (
    <Routes>
      {userRouters.map((item, key) => (
        item.path === ROUTERS.AUTH.LOGIN || item.path === ROUTERS.AUTH.REGISTER ? (
          <Route key={key} path={item.path} element={item.Component} />
        ) : (
          <Route
            key={key}
            path={item.path}
            element={<MasterLayout>{item.Component}</MasterLayout>}
          />
        )
      ))}
    </Routes>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};

export default RouterCustom;
