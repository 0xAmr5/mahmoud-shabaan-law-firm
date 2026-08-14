import { db } from '../firebase/config';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export const chatService = {
  getChatRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
  },

  async getOrCreateChatRoom({ user1, user2 }) {
    try {
      const chatId = this.getChatRoomId(user1.uid, user2.uid);
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          id: chatId,
          participants: [user1.uid, user2.uid],
          participantDetails: {
            [user1.uid]: { name: user1.name, role: user1.role },
            [user2.uid]: { name: user2.name, role: user2.role },
          },
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      }

      return { chatId, error: null };
    } catch (error) {
      return { chatId: null, error: error.message };
    }
  },

  listenToMessages(chatId, callback) {
    if (!chatId) return () => {};

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(messages);
    });
  },

  async sendMessage({ chatId, senderId, senderName, senderRole, text }) {
    if (!text.trim() || !chatId) return { success: false };

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId,
        senderName,
        senderRole,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });

      const chatRef = doc(db, 'chats', chatId);
      await setDoc(
        chatRef,
        {
          lastMessage: text.trim(),
          lastMessageAt: serverTimestamp(),
          lastSenderId: senderId,
        },
        { merge: true }
      );

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  listenToUserChats(userId, callback) {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId));

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(chats);
    });
  },
};