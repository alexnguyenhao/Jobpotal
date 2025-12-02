import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      state.notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },

    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n._id === notificationId
      );
      if (notification) {
        notification.isRead = true;
      }
    },

    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    },

    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
        (n) => n._id !== notificationId
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
