import React, { useState, useMemo } from 'react';
import { FaSearch, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddFriendCard from '../../../components/addFriendCard';
import { useFriendSuggestions } from '../../../hooks/friends/useFriendSuggestions';
import { useFriendActions } from '../../../hooks/friends/useFriendActions';
import './style.scss';

const SuggestionsIcon = ({ icon: Icon, className }) => {
  const themeClass = `suggestions-page-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendSuggestionsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { suggestions, loading, error, refetch } = useFriendSuggestions();
  const { sendRequest, loading: actionLoading } = useFriendActions();

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) return suggestions;
    
    return suggestions.filter(user => 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suggestions, searchTerm]);

  const handleSendRequest = async (userId) => {
    try {
      await sendRequest(userId);
      refetch();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleBack = () => {
    navigate('/friends');
  };

  return (
    <div className="friend-suggestions-page">
      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={handleBack}>
            <SuggestionsIcon icon={FaArrowLeft} />
            Quay lại
          </button>
          <h1>Gợi ý kết bạn</h1>
        </div>

        <div className="search-section">
          <div className="search-box">
            <SuggestionsIcon icon={FaSearch} />
            <input
              type="text"
              placeholder="Tìm kiếm trong gợi ý..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="suggestions-content">
          {loading ? (
            <div className="loading-state">
              <SuggestionsIcon icon={FaSpinner} className="spinner" />
              <p>Đang tải gợi ý kết bạn...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Không thể tải gợi ý kết bạn: {error}</p>
              <button onClick={refetch} className="retry-button">
                Thử lại
              </button>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <p>Không tìm thấy kết quả cho "{searchTerm}"</p>
              ) : (
                <p>Không có gợi ý kết bạn nào</p>
              )}
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  {searchTerm ? 
                    `Tìm thấy ${filteredSuggestions.length} kết quả cho "${searchTerm}"` :
                    `${filteredSuggestions.length} gợi ý kết bạn`
                  }
                </p>
              </div>
              <div className="suggestions-grid">
                {filteredSuggestions.map((user) => (
                  <AddFriendCard
                    key={user.id}
                    user={user}
                    onAdd={() => handleSendRequest(user.id)}
                    loading={{
                      add: actionLoading.sendRequest === user.id
                    }}
                    mutualFriendsCount={user.mutualFriendsCount || 0}
                    showRemove={true}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendSuggestionsPage;
