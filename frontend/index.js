import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Masterlayout from './src/layouts/masterLayout';
import PersonalPage from './src/pages/users/personalPage';
import HomePage from './src/pages/users/homePage';
import FriendsPage from './src/pages/users/friendsPage';
import WatchPage from './src/pages/users/watchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Masterlayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<PersonalPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/watch" element={<WatchPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));