// frontend/src/components/notifications/NotificationBell.jsx
import React, { useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import NotificationList from "./NotificationList";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleMarkRead = async (id) => {
    await markRead(id);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((s) => !s)} className="relative">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2">
          <NotificationList
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAll={markAllRead}
          />
        </div>
      )}
    </div>
  );
}
