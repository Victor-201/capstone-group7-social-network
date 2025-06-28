import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/users/homePage';
import PersonalPage from './pages/users/personalPage';
import WatchPage from './pages/users/watchPage';
import FriendsPage from './pages/users/friendsPage';
import GroupsPage from './pages/users/groupsPage';
import TermsOfServicePage from './pages/users/termsOfServicePage';
import AuthPage from './pages/users/authPage';
import MasterLayout from './layouts/masterLayout';
import PrivateRoute from './components/privateRoute';
import SettingsPage from './pages/users/settingsPage';
import { ROUTERS } from './utils/router';

const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      Component: <HomePage />,
      roles: ['user', 'admin'],
    },
    {
      path: ROUTERS.USER.FRIENDS,
      Component: <FriendsPage />,
      roles: ['user', 'admin'],
    },
    {
      path: ROUTERS.USER.WATCH,
      Component: <WatchPage />,
      roles: ['user', 'admin'],
    },
    {
      path: ROUTERS.USER.GROUPS,
      Component: <GroupsPage />,
      roles: ['user', 'admin'],
    },
    {
      path: ROUTERS.USER.PROFILE,
      Component: <PersonalPage />,
      roles: ['user', 'admin'],
    },
    {
      path: ROUTERS.USER.SETTINGS,
      Component: <SettingsPage />,
      roles: ['user', 'admin'],
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
      Component: <AuthPage />,
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
            <PrivateRoute roles={item.roles}>
              <MasterLayout>{item.Component}</MasterLayout>
            </PrivateRoute>
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
