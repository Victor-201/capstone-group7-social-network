import { memo } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/about">About</Link>
                    <Link to="/help">Help</Link>
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/careers">Careers</Link>
                </div>
                <div className="footer-copyright">
                    Social Network © {currentYear}
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);