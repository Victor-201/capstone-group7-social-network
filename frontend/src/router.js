import HomePage from './pages/users/homePage';
import ProfilePage from './pages/users/profilePage';
import FriendsPage from './pages/users/friendsPage';
import WatchPage from './pages/users/watchPage';
import MarketplacePage from './pages/users/marketplacePage';
import MasterLayout from './pages/users/theme/masterLayout';
import { ROUTERS } from './utils/router';
import { Route, Routes } from 'react-router-dom';

const renderUserRouter = () => {
    const userRouters = [
        {
            path: ROUTERS.USER.HOME,
            Component: <HomePage />,
        },
        {
            path: ROUTERS.USER.PROFILE,
            Component: <ProfilePage />,
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
            path: ROUTERS.USER.MARKETPLACE,
            Component: <MarketplacePage />,
        }
    ];
    
    return (
        <MasterLayout>
            <Routes>
                {userRouters.map((item, key) => (
                    <Route key={key} path={item.path} element={item.Component} />
                ))}
            </Routes>
        </MasterLayout>
    );
};

const RouterCustom = () => {
    return renderUserRouter();
};

export default RouterCustom;
