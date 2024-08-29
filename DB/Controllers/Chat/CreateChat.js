import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../../FirebaseConfig.js'
export const CreateChat = async (req, res) => {
  try {
    const { userId, receiverId } = req.body
    if (!userId || !receiverId) {
      return res
        .status(400)
        .json({ error: 'userId and receiverId are required' })
    }
    // Reference to the 'Chats' collection in Firestore
    const chatsCollection = collection(db, 'Chats')
    // Query to find if there's an existing chat between userId and receiverId
    const userChatsRef = doc(chatsCollection, userId)
    const receiverChatsRef = doc(chatsCollection, receiverId)
    const userChatsDoc = await getDoc(userChatsRef)
    const receiverChatsDoc = await getDoc(receiverChatsRef)
    if (userChatsDoc.exists() && receiverChatsDoc.exists()) {
      const userChats = userChatsDoc.data().chats || []
      const receiverChats = receiverChatsDoc.data().chats || []
      // Check if a chat already exists in either user's chat list
      const chatExists =
        userChats.some((chat) => chat.receiverId === receiverId) ||
        receiverChats.some((chat) => chat.receiverId === userId)
      if (chatExists) {
        const existingChat =
          userChats.find((chat) => chat.receiverId === receiverId) ||
          receiverChats.find((chat) => chat.receiverId === userId)
        return res.status(200).json({
          chatID: existingChat.chatID,
          message: 'Chat already exists',
        })
      }
    }
    // Create a new chat document
    const newChatDocRef = doc(collection(db, 'userchats'))
    await setDoc(newChatDocRef, {
      createdAt: serverTimestamp(),
      messages: [], // Initialize with an empty array for messages
    })
    // Update the 'Chats' document for the user with userId
    await updateDoc(userChatsRef, {
      chats: arrayUnion({
        chatID: newChatDocRef.id,
        LastMessage: '',
        receiverId: receiverId,
        UpdatedAt: new Date().toLocaleString(),
      }),
    })
    // Update the 'Chats' document for the user with receiverId
    await updateDoc(receiverChatsRef, {
      chats: arrayUnion({
        chatID: newChatDocRef.id,
        LastMessage: '',
        receiverId: userId,
        UpdatedAt: new Date().toLocaleString(),
      }),
    })
    res.status(200).json({
      chatID: newChatDocRef.id,
      message: 'Chat created successfully',
    })
    console.log('Chat created:', newChatDocRef.id)
  } catch (error) {
    console.error('Error creating chat:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
