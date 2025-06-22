// import { useState } from 'react';
// import { 
//     markNotificationAsRead, 
//     markAllNotificationsAsRead,
//     deleteNotification
// } from '../../api/notificationApi';

// export const useNotificationActions = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const markAsRead = async (notificationId) => {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error("No token provided");

//         try {
//             setLoading(true);
//             setError(null);
//             const data = await markNotificationAsRead(token, notificationId);
//             return data;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markAllAsRead = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error("No token provided");

//         try {
//             setLoading(true);
//             setError(null);
//             const data = await markAllNotificationsAsRead(token);
//             return data;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteNotif = async (notificationId) => {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error("No token provided");

//         try {
//             setLoading(true);
//             setError(null);
//             const data = await deleteNotification(token, notificationId);
//             return data;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         markAsRead,
//         markAllAsRead,
//         deleteNotif,
//         loading,
//         error
//     };
// };
