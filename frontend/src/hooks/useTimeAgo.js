import { useEffect, useState } from 'react';

const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} giờ`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ngày`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInDays < 30) {
        return `${diffInWeeks} tuần`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (diffInMonths >= 24 || diffInYears >= 1) {
        return `${day} tháng ${month}, ${year}`;
    }

    if (diffInMonths >= 2) {
        return `${day} tháng ${month}`;
    }

    return `${diffInMonths} tháng`;
};


const useTimeAgo = (dateString, refreshInterval = 60000) => {
    const [timeAgo, setTimeAgo] = useState(() => getTimeAgo(dateString));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(getTimeAgo(dateString));
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [dateString, refreshInterval]);

    return timeAgo;
};

export default useTimeAgo;
