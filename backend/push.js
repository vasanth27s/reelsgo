import webpush from "web-push";
import PushSubscription from "./models/PushSubscription.js";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";
import Notification from "./models/Notification.js";

const publicKey = process.env.VAPID_PUBLIC_KEY || "";
const privateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidReady = Boolean(publicKey && privateKey);
if (vapidReady) {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@reelsgo.app", publicKey, privateKey);
} else {
  console.warn("Web push is disabled: set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to enable background notifications.");
}

export async function sendPushToUser(userId, payload) {
  if (!vapidReady || !userId) return;
  const rows = await PushSubscription.find({ user: userId }).lean();
  const conversations = await Conversation.find({ members: userId }).select("_id").lean();
  const conversationIds = conversations.map(conversation => conversation._id);
  const [unreadMessages, unreadNotifications] = await Promise.all([
    conversationIds.length ? Message.countDocuments({ conversation: { $in: conversationIds }, sender: { $ne: userId }, seenBy: { $ne: userId }, deletedFor: { $ne: userId } }) : 0,
    Notification.countDocuments({ recipient: userId, read: false })
  ]);
  const notificationPayload = { ...payload, badgeCount: Math.max(0, unreadMessages + unreadNotifications) };
  await Promise.all(rows.map(async row => {
    try { await webpush.sendNotification(row.subscription, JSON.stringify(notificationPayload)); }
    catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) await PushSubscription.deleteOne({ _id: row._id });
      else console.warn("Push delivery failed:", error?.statusCode || error?.message);
    }
  }));
}
