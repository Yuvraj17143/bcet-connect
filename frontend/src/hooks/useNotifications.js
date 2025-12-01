import { useEffect, useState } from "react";
import api from "../services/apiClient";
import socket from "../services/socket";

export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  // Load from backend
  const load = async () => {
    const res = await api.get("/notifications");
    setItems(res.data.data.items);
    setUnread(res.data.data.unreadCount);
  };

  useEffect(() => {
    load();

    // 🔥 Real-time listener
    socket.on("notification:new", (notif) => {
      setItems((prev) => [notif, ...prev]);
      setUnread((u) => u + 1);
    });

    return () => {
      socket.off("notification:new");
    };
  }, []);

  return { items, unread, reload: load };
}
