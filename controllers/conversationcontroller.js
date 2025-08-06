import createError from "../utils/createError.js";
import Conversation from "../models/Conversation.js";
import Gig from "../models/Gig.js";

export const createConversation = async (req, res, next) => {
  console.log("createConversation called with:", {
    isSeller: req.isSeller,
    userId: req.userId,
    to: req.body.to,
  });

  const conversationId = req.isSeller
    ? req.userId + req.body.to
    : req.body.to + req.userId;
  console.log("Generated conversation ID:", conversationId);

  const newConversation = new Conversation({
    id: conversationId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });

  try {
    const savedConversation = await newConversation.save();
    console.log("Conversation created successfully:", savedConversation._id);
    res.status(201).send(savedConversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    console.log("getSingleConversation called with ID:", req.params.id);

    // Try to find by _id first, then by custom id
    let conversation = await Conversation.findById(req.params.id);
    console.log("Found by _id:", conversation ? "Yes" : "No");

    if (!conversation) {
      conversation = await Conversation.findOne({ id: req.params.id });
      console.log("Found by custom id:", conversation ? "Yes" : "No");
    }

    if (!conversation) {
      console.log("No conversation found for ID:", req.params.id);
      return next(createError(404, "Not found!"));
    }

    console.log("Returning conversation:", conversation._id);
    res.status(200).send(conversation);
  } catch (err) {
    console.error("Error in getSingleConversation:", err);
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    console.log(
      "getConversations called for user:",
      req.userId,
      "isSeller:",
      req.isSeller
    );

    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });

    console.log("Found conversations:", conversations.length);
    conversations.forEach((c) =>
      console.log("Conversation:", {
        _id: c._id,
        id: c.id,
        sellerId: c.sellerId,
        buyerId: c.buyerId,
      })
    );

    res.status(200).send(conversations);
  } catch (err) {
    console.error("Error in getConversations:", err);
    next(err);
  }
};

export const getConversationByGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    console.log(
      "getConversationByGig called for gigId:",
      gigId,
      "userId:",
      req.userId
    );

    // Get the gig to find the seller
    const gig = await Gig.findById(gigId);
    if (!gig) {
      console.log("Gig not found for ID:", gigId);
      return next(createError(404, "Gig not found!"));
    }

    console.log("Gig seller ID:", gig.userId);

    // Try to find existing conversation between current user and gig seller
    const conversation = await Conversation.findOne({
      $or: [
        { sellerId: req.userId, buyerId: gig.userId },
        { sellerId: gig.userId, buyerId: req.userId },
      ],
    });

    if (conversation) {
      console.log("Found conversation:", conversation._id);
      res.status(200).send(conversation);
    } else {
      console.log("No conversation found");
      res.status(404).send({ message: "No conversation found" });
    }
  } catch (err) {
    console.error("Error in getConversationByGig:", err);
    next(err);
  }
};

// Debug endpoint to check all conversations
export const debugConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({});
    console.log("All conversations in database:", conversations.length);
    conversations.forEach((c) =>
      console.log("Conversation:", {
        _id: c._id,
        id: c.id,
        sellerId: c.sellerId,
        buyerId: c.buyerId,
      })
    );
    res.status(200).send({ count: conversations.length, conversations });
  } catch (err) {
    console.error("Error in debugConversations:", err);
    next(err);
  }
};
