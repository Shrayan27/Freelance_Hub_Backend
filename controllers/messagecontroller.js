import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import createError from "../utils/createError.js";

export const createMessage = async (req, res, next) => {
  try {
    // Get the conversation to find the correct id
    const conversation = await Conversation.findById(req.body.conversationId);
    if (!conversation) {
      return next(createError(404, "Conversation not found!"));
    }

    const newMessage = new Message({
      conversationId: conversation.id, // Use the custom id
      userId: req.userId,
      desc: req.body.desc,
    });

    const savedMessage = await newMessage.save();

    await Conversation.findOneAndUpdate(
      { id: conversation.id },
      {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
        lastMessage: req.body.desc,
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    // Try to find messages by conversation _id first, then by custom id
    let messages = await Message.find({ conversationId: req.params.id });
    if (messages.length === 0) {
      // If no messages found, try to find conversation by _id and get its custom id
      const conversation = await Conversation.findById(req.params.id);
      if (conversation) {
        messages = await Message.find({ conversationId: conversation.id });
      }
    }
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Conversation.findOneAndUpdate(
      { id: req.params.conversationId },
      {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
      },
      { new: true }
    );
    res.status(200).send("Message marked as read.");
  } catch (err) {
    next(err);
  }
};
