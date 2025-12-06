import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { getReceiverSocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, jobId, applicationId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let query = { participants: { $all: [senderId, receiverId] } };

    if (applicationId) {
      query.application = applicationId;
    } else if (jobId) {
      query.job = jobId;
    }

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        job: jobId,
        application: applicationId,
      });
    }

    conversation.updatedAt = new Date();

    if (conversation.hiddenBy.includes(receiverId)) {
      conversation.hiddenBy = conversation.hiddenBy.filter(
        (id) => id.toString() !== receiverId.toString()
      );
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      isRead: false,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    const messageToSend = newMessage.toObject();
    messageToSend.conversationId = conversation._id;
    messageToSend.jobId = jobId;
    messageToSend.applicationId = applicationId;

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageToSend);
    }

    res.status(201).json(messageToSend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const { jobId, applicationId } = req.query;

    let query = {
      participants: { $all: [senderId, userToChatId] },
    };

    if (applicationId && applicationId !== "undefined") {
      query.application = applicationId;
    } else if (jobId && jobId !== "undefined") {
      query.job = jobId;
    }

    const conversation = await Conversation.findOne(query).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const deleteRecord = conversation.deletedBy.find(
      (d) => d.user.toString() === senderId.toString()
    );

    let messages = conversation.messages;

    if (deleteRecord) {
      messages = messages.filter(
        (msg) => new Date(msg.createdAt) > new Date(deleteRecord.deletedAt)
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversationsUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Auth failed" });
    const userId = req.user._id;
    const userRole = req.user.role;

    const existingConversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "-password",
        populate: { path: "company" },
      })
      .populate("job")
      .populate("application")
      .populate({
        path: "messages",
        select: "senderId isRead createdAt",
      })
      .sort({ updatedAt: -1 });

    const chatPartners = existingConversations.reduce((acc, conv) => {
      // --- FIX LỖI TẠI ĐÂY ---
      // Kiểm tra xem hiddenBy có tồn tại không trước khi gọi includes
      if (conv.hiddenBy && conv.hiddenBy.includes(userId)) return acc;

      // Kiểm tra an toàn cho deletedBy
      const deletedByList = conv.deletedBy || [];
      const deleteRecord = deletedByList.find(
        (d) => d.user.toString() === userId.toString()
      );

      let hasNewMessageAfterDelete = true;
      if (deleteRecord) {
        const lastMsg = conv.messages[conv.messages.length - 1];
        if (
          !lastMsg ||
          new Date(lastMsg.createdAt) <= new Date(deleteRecord.deletedAt)
        ) {
          hasNewMessageAfterDelete = false;
        }
      }

      if (!hasNewMessageAfterDelete) return acc;

      const partner = conv.participants.find(
        (p) => p && p._id.toString() !== userId.toString()
      );

      if (partner) {
        const partnerObj = partner.toObject();

        const unreadCount = conv.messages.reduce((count, msg) => {
          if (msg.senderId.toString() !== userId.toString() && !msg.isRead) {
            return count + 1;
          }
          return count;
        }, 0);

        partnerObj.unreadCount = unreadCount;
        partnerObj.lastActive = conv.updatedAt;

        if (conv.job) {
          partnerObj.jobId = conv.job._id;
          partnerObj.lastJobTitle = conv.job.title;
        }
        if (conv.application) {
          partnerObj.applicationId = conv.application._id;
        }
        partnerObj.conversationId = conv._id;

        acc.push(partnerObj);
      }
      return acc;
    }, []);

    let potentialPartners = [];

    if (userRole === "student") {
      const applications = await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "job",
          populate: [
            { path: "created_by", select: "-password" },
            { path: "company" },
          ],
        });

      const uniqueJobMap = new Map();

      applications.forEach((app) => {
        const recruiter = app.job?.created_by;
        if (recruiter && app.job) {
          const key = `${recruiter._id.toString()}_${app.job._id.toString()}`;

          if (!uniqueJobMap.has(key)) {
            const recruiterObj = recruiter.toObject();
            if (app.job.company) {
              recruiterObj.company = app.job.company;
            }
            recruiterObj.lastJobTitle = app.job.title;
            recruiterObj.jobId = app.job._id;
            recruiterObj.applicationId = app._id;
            recruiterObj.createdAt = app.createdAt;

            uniqueJobMap.set(key, recruiterObj);
          }
        }
      });
      potentialPartners = Array.from(uniqueJobMap.values());
    } else if (userRole === "recruiter") {
      const jobs = await Job.find({ created_by: userId });
      const jobIds = jobs.map((j) => j._id);

      const applications = await Application.find({ job: { $in: jobIds } })
        .sort({ createdAt: -1 })
        .populate("applicant", "-password")
        .populate("job");

      const uniqueApplicantMap = new Map();

      applications.forEach((app) => {
        const student = app.applicant;
        if (student && app.job) {
          const key = `${student._id.toString()}_${app._id.toString()}`;

          if (!uniqueApplicantMap.has(key)) {
            const studentObj = student.toObject();
            studentObj.lastJobTitle = app.job.title;
            studentObj.jobId = app.job._id;
            studentObj.applicationId = app._id;
            studentObj.createdAt = app.createdAt;

            uniqueApplicantMap.set(key, studentObj);
          }
        }
      });
      potentialPartners = Array.from(uniqueApplicantMap.values());
    }

    const usersMap = new Map();

    const generateKey = (user) => {
      if (user.applicationId)
        return `${user._id.toString()}_${user.applicationId.toString()}`;
      if (user.jobId) return `${user._id.toString()}_${user.jobId.toString()}`;
      return user._id.toString();
    };

    potentialPartners.forEach((u) => {
      usersMap.set(generateKey(u), u);
    });

    chatPartners.forEach((u) => {
      const key = generateKey(u);
      if (usersMap.has(key)) {
        usersMap.set(key, {
          ...usersMap.get(key),
          ...u,
        });
      } else {
        usersMap.set(key, u);
      }
    });

    let finalUsers = Array.from(usersMap.values());

    finalUsers.sort((a, b) => {
      const dateA = new Date(a.lastActive || a.createdAt || 0).getTime();
      const dateB = new Date(b.lastActive || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    res.status(200).json(finalUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ error: "Not found" });

    const result = await Message.updateMany(
      {
        _id: { $in: conversation.messages },
        receiverId: userId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

export const hideConversation = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      $addToSet: { hiddenBy: userId },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    res.status(200).json({ success: true, message: "Conversation hidden" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const existingDelete = conversation.deletedBy.find(
      (d) => d.user.toString() === userId.toString()
    );

    if (existingDelete) {
      existingDelete.deletedAt = new Date();
    } else {
      conversation.deletedBy.push({ user: userId, deletedAt: new Date() });
    }

    if (conversation.hiddenBy.includes(userId)) {
      conversation.hiddenBy = conversation.hiddenBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    await conversation.save();

    res.status(200).json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};
