import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../../FirebaseConfig.js'
export const CreateChat = async (req, res) => {
  try {
    // Extracting userId and receiverId from the request body
    const { userId, receiverId } = req.body

    // Check if userId is provided in the request body
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Reference to the 'userchats' collection in Firestore
    const userChatsCollection = collection(db, 'userchats')
    // Reference to the 'Chats' collection in Firestore
    const chatsCollection = collection(db, 'Chats')

    // Create a new document reference in the 'userchats' collection
    const newChatDocRef = doc(userChatsCollection)

    // Create a new chat document with initial data
    await setDoc(newChatDocRef, {
      createdAt: serverTimestamp(),
      messages: [], // Initialize with an empty array for messages
    })

    // Update the 'Chats' document for the user with userId
    await updateDoc(doc(chatsCollection, userId), {
      chatID: newChatDocRef.id,
      LastMessage: '',
      receiverId: receiverId,
      UpdatedAt: new Date().toLocaleString(),
    })

    // Update the 'Chats' document for the user with receiverId
    await updateDoc(doc(chatsCollection, receiverId), {
      chatID: newChatDocRef.id,
      LastMessage: '',
      receiverId: userId,
      UpdatedAt: new Date().toLocaleString(),
    })

    // Send a successful response with the new chat ID
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
