import NotificationItem from '../../../../components/notificationItem';
import Loader from '../../../../components/loader';
import emptyNotification from '../../../../assets/images/empty/empty_notification.gif'

const NotificationSection = ({ notifications, loading, error, onClose, reloadNotifications }) => {
    return (
        <section className="popup__section popup__section--notification">
            {loading ? (
                <div className="popup__loader">
                    <Loader />
                </div>
            ) : error ? (
                <div className="popup__error">{error}</div>
            ) : notifications.length === 0 ? (
                <div className="popup__no-notification">
                    <img src={emptyNotification} alt="No notification" />
                    <span>Không có thống báo</span>
                </div>
            ) : (
                <ul className="popup__notification-list">
                    {notifications.map(noti => (
                        <NotificationItem
                            key={noti.id}
                            noti={noti}
                            onClose={onClose}
                            reloadNotifications={reloadNotifications} 
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default NotificationSection;
