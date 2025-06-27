import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './style.scss';

const TABS = {
    INFO: 'Thông tin cá nhân',
    SECURITY: 'Mật khẩu và bảo mật',
};

const tabKeyMap = {
    info: TABS.INFO,
    security: TABS.SECURITY,
};

const SettingsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(TABS.INFO);

    useEffect(() => {
        const tabQuery = searchParams.get('tab');
        if (tabQuery && tabKeyMap[tabQuery]) {
            setActiveTab(tabKeyMap[tabQuery]);
        }
    }, [searchParams]);

    const changeTab = (key) => {
        setSearchParams({ tab: key });
        setActiveTab(TABS[key.toUpperCase()]);
    };

    const [formData, setFormData] = useState({
        full_name: '',
        birthday: '',
        email: '',
        phone: '',
        user_name: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit for', activeTab, formData);
    };

    const renderTabContent = () => {
        if (activeTab === TABS.INFO) {
            return (
                <form onSubmit={handleSubmit} className="settings-form">
                    <h3>{TABS.INFO}</h3>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Họ và tên" />
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} placeholder="Ngày sinh" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" />
                    <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} placeholder="Tên người dùng" />
                    <p>Liên kết của bạn: tenweb.com/{formData.user_name || 'username'}</p>
                    <button type="submit">Lưu thay đổi</button>
                </form>
            );
        } else if (activeTab === TABS.SECURITY) {
            return (
                <form onSubmit={handleSubmit} className="settings-form">
                    <h3>{TABS.SECURITY}</h3>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu hiện tại" />
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Mật khẩu mới" />
                    <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu mới" />
                    <button type="submit">Đổi mật khẩu</button>
                </form>
            );
        }
        return null;
    };

    return (
        <div className="container">
        <div className="settings-page">
            <div className="settings-sidebar">
                {Object.entries(TABS).map(([key, label]) => (
                    <div
                        key={key}
                        className={`settings-tab ${activeTab === label ? 'active' : ''}`}
                        onClick={() => changeTab(key)}
                    >
                        {label}
                    </div>
                ))}
            </div>
            <div className="settings-content">{renderTabContent()}</div>
        </div>
        </div>
    );
};

export default SettingsPage;
