import { memo } from 'react';
import Header from '../header';
import Footer from '../footer';
import { useLocation } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router';

const Masterlayout = ({children, ...props}) => {
    const location = useLocation();
    
    return (
        <div {...props}>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default memo(Masterlayout);