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
                    <Link to="/help">Help Center</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                    <Link to="/careers">Careers</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
                <div className="footer-copyright">
                    Capstone Social © {currentYear} | Made with ❤️ by Group 7
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);