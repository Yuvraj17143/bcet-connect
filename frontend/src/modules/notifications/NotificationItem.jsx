// frontend/src/components/notifications/NotificationItem.jsx
import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationItem({ n, onClick, onMarkRead }) {
  const bg = n.isRead ? "bg-white" : "bg-slate-50";
  const icon = {
    job: "💼",
    event: "🎉",
    community: "📣",
    chat: "💬",
    donation: "❤️",
    ai: "🤖",
    admin: "🔔"
  }[n.type] || "🔔";

  return (
    <div
      className={`${bg} p-3 rounded-md border hover:shadow-sm flex gap-3`}
      role="button"
    >
      <div className="text-xl">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-sm font-semibold">{n.title}</p>
            <p className="text-xs text-gray-600">{n.message}</p>
          </div>
          <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {!n.isRead && (
            <button
              onClick={onMarkRead}
              className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600"
            >
              Mark read
            </button>
          )}
          {n.redirectUrl && (
            <a href={n.redirectUrl} className="text-xs text-indigo-600 underline">
              Open
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
