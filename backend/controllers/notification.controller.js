import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;

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

export const markAsRead = async (req, res) => {
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
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndDelete(notificationId);
    return res.status(200).json({
      message: "Deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

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
