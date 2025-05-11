import UserSection from './UserSection';
import NotificationSection from './NotificationSection';
import MessageSection from './MessageSection';
import './style.scss';

const UserPanelPopup = ({ type, user, onClose }) => {
    return (
        <div className="popup__user-panel">
            {type === 'user' && <UserSection user={user} onClose={onClose} />}
            {type === 'noti' && <NotificationSection />}
            {type === 'mess' && <MessageSection />}
        </div>
    );
};

export default UserPanelPopup;