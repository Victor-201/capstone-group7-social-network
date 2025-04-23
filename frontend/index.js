import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonalPage from './pages/users/personalPage';
import HomePage from './pages/users/homePage';
import FriendsPage from './pages/users/friendsPage';
import WatchPage from './pages/users/watchPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<PersonalPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/watch" element={<WatchPage />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));