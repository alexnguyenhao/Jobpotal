import { Notification } from "../models/notification.model.js";

// 1. Get Notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;

    // Sửa lại query: recipient là userId
    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch notifications",
      success: false,
    });
  }
};

// 2. Mark As Read (SỬA LỖI Ở ĐÂY)
export const markAsRead = async (req, res) => {
  try {
    const userId = req.id;
    const notificationId = req.body.id; 

    if (!notificationId) {
        return res.status(400).json({ message: "Notification ID required", success: false });
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { recipient: userId, _id: notificationId },
      { $set: { isRead: true } },
      { new: true } 
    );

    if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found", success: false });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.id;
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// 4. Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id; // Route delete thường là /delete/:id nên dùng params là đúng
    
    const deleted = await Notification.findByIdAndDelete(notificationId);
    
    if (!deleted) {
        return res.status(404).json({ message: "Notification not found", success: false });
    }

    return res.status(200).json({
      message: "Deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error); // Nên log lỗi ra để debug
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// 5. Count Unread
export const unRead = async (req, res) => {
  try {
    const userId = req.id;
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
    return res.status(200).json({
      success: true,
      unReadCount: count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};