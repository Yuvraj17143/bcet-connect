// frontend/src/components/notifications/NotificationList.jsx
import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications = [], onMarkRead, onMarkAll }) {
  return (
    <div className="w-[360px] max-h-[70vh] overflow-y-auto p-3 space-y-2 bg-white rounded shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={onMarkAll} className="text-xs text-gray-500">Mark all read</button>
      </div>

      {notifications.length === 0 && (
        <div className="text-sm text-gray-500">No notifications</div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n._id}>
            <NotificationItem
              n={n}
              onMarkRead={() => onMarkRead(n._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
