import React, { useState } from 'react';
import { Bell, Check, Trash2, RefreshCw, CheckSquare } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow, format } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refreshNotifications
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'success' | 'error' | 'info' | 'warning'>('all');

  const handleRefresh = () => {
    refreshNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>;
      case 'error':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">✕</div>;
      case 'warning':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">⚠</div>;
      case 'info':
      default:
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">ℹ</div>;
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        exact: format(date, 'PPpp') // e.g., "Apr 29, 2021, 5:30 PM"
      };
    } catch (error) {
      return {
        relative: 'some time ago',
        exact: 'unknown date'
      };
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Refresh notifications"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                title="Mark all as read"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="text-sm text-gray-600 mr-2">Status:</label>
            <select 
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">Type:</label>
            <select 
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700">
          <p>Error: {error}</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No notifications found</p>
          {filter !== 'all' || typeFilter !== 'all' ? (
            <p className="text-sm mt-2">Try changing your filters</p>
          ) : null}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredNotifications.map((notification) => {
            const time = getTimeAgo(notification.created_at);
            return (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-500" title={time.exact}>{time.relative}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {notification.action_url && (
                      <a 
                        href={notification.action_url} 
                        className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      >
                        View details
                      </a>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-4 flex flex-col space-y-2">
                    {!notification.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notification.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {notifications.length > 0 && filteredNotifications.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <p>No notifications match your filters</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;