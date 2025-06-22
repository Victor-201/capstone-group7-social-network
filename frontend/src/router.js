import HomePage from './pages/users/homePage';
import PersonalPage from './pages/users/personalPage';
import WatchPage from './pages/users/watchPage';
import ForgotPasswordPage from './pages/users/forgotPasswordPage';
import FriendsPage from './pages/users/friendsPage';
import GroupsPage from './pages/users/groupsPage';
import MasterLayout from './layouts/masterLayout';
import { ROUTERS } from './utils/router';
import { Route, Routes } from 'react-router-dom';
import AuthPage from './pages/users/authPage';

const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      Component: <HomePage />,
    },
    {
      path: ROUTERS.USER.FRIENDS,
      Component: <FriendsPage />,
    },
    {
      path: ROUTERS.USER.WATCH,
      Component: <WatchPage />,
    },
    {
      path: ROUTERS.USER.GROUPS,
      Component: <GroupsPage />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      Component: <PersonalPage />,
    },
    {
      path: ROUTERS.AUTH.LOGIN,
      Component: <AuthPage />,
    },
    {
      path: ROUTERS.AUTH.REGISTER,
      Component: <AuthPage />,
    },
    {
      path: ROUTERS.AUTH.FORGOT_PASSWORD,
      Component: <ForgotPasswordPage />,
    }
  ];

  return (
    <Routes>
      {userRouters.map((item, key) => (
        item.path === ROUTERS.AUTH.LOGIN || item.path === ROUTERS.AUTH.REGISTER || item.path === ROUTERS.AUTH.FORGOT_PASSWORD ? (
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
