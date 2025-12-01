import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/apiClient";
import io from "socket.io-client";

const AuthContext = createContext(null);

// For socket connection
let socket = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false); // routing flag
  const [unreadCount, setUnreadCount] = useState(0);

  //---------------------------------------------------------
  // 🔥 1) Attach Token To All Axios Requests Automatically
  //---------------------------------------------------------
  useEffect(() => {
    api.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);


  //---------------------------------------------------------
  // 🔥 2) AUTO LOGIN: Fetch /auth/me when token exists
  //---------------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        setAuthReady(true);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        const me = res.data.data;

        setUser(me);
        setRole(me.role);
        localStorage.setItem("user", JSON.stringify(me));
        localStorage.setItem("role", me.role);

        // connect socket
        connectSocket(me._id);

        // fetch notifications
        await fetchUnreadNotifications();
      } catch (err) {
        console.error("Auto-login failed:", err?.response?.data || err.message);
        logout();
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    loadUser();
  }, [token]);


  //---------------------------------------------------------
  // 🔥 3) SOCKET CONNECTION (Real-Time Notifications)
  //---------------------------------------------------------
  const connectSocket = (userId) => {
    if (socket) return;

    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.emit("auth:join", { userId });

    socket.on("notification:new", (notif) => {
      setUnreadCount((prev) => prev + 1);
      console.log("🔔 New Notification:", notif);
    });
  };


  //---------------------------------------------------------
  // 🔥 4) LOGIN
  //---------------------------------------------------------
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { user, token } = res.data.data;

    setToken(token);
    localStorage.setItem("token", token);

    setUser(user);
    setRole(user.role);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);

    connectSocket(user._id);

    await fetchUnreadNotifications();

    return user;
  };


  //---------------------------------------------------------
  // 🔥 5) LOGOUT
  //---------------------------------------------------------
  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    setRole("");
    setUnreadCount(0);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }, []);


  //---------------------------------------------------------
  // 🔥 6) FETCH UNREAD NOTIFICATIONS
  //---------------------------------------------------------
  const fetchUnreadNotifications = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data.data.unreadCount || 0);
    } catch (err) {
      console.error("Unread fetch error:", err?.response?.data || err.message);
    }
  };


  //---------------------------------------------------------
  // 🔥 FINAL VALUE PROVIDED TO GLOBAL APP
  //---------------------------------------------------------
  const value = {
    user,
    setUser,
    token,
    role,
    loading,
    authReady,
    unreadCount,
    login,
    logout,
    fetchUnreadNotifications,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
