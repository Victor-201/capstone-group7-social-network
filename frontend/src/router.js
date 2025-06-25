import HomePage from './pages/users/homePage';
import PersonalPage from './pages/users/personalPage';
import WatchPage from './pages/users/watchPage';
import ForgotPasswordPage from './pages/users/forgotPasswordPage';
import FriendsPage from './pages/users/friendsPage';
import GroupsPage from './pages/users/groupsPage';
import MasterLayout from './layouts/masterLayout';
import TermsOfServicePage from './pages/users/termsOfServicePage';
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
  ];

  const publicRouters = [
    {
      path: ROUTERS.PUBLIC.LOGIN,
      Component: <AuthPage />,
    },
    {
      path: ROUTERS.PUBLIC.REGISTER,
      Component: <AuthPage />,
    },
    {
      path: ROUTERS.PUBLIC.FORGOT_PASSWORD,
      Component: <ForgotPasswordPage />,
    },
    {
      path: ROUTERS.PUBLIC.TERMS_OF_SERVICE,
      Component: <TermsOfServicePage />,
    },
  ];

  return (
    <Routes>
      {publicRouters.map((item, key) => (
        <Route key={key} path={item.path} element={item.Component} />
      ))}

      {userRouters.map((item, key) => (
        <Route
          key={key}
          path={item.path}
          element={
              <MasterLayout>{item.Component}</MasterLayout>
          }
        />
      ))}
    </Routes>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};

export default RouterCustom;
