import { memo } from 'react';
import Header from '../header';

const Masterlayout = ({children, ...props}) => {
    
    return (
        <div {...props}>
            <Header />
            {children}
        </div>
    );
};

export default memo(Masterlayout);