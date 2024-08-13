import express from 'express'
import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../FirebaseConfig.js'

const ChatRouter = express.Router()

ChatRouter.post('/', async (req, res) => {
  try {
    const { UserID } = req.body

    // Check if UserID is provided in the request body
    if (!UserID) {
      return res.status(400).json({ error: 'UserID is required' })
    }

    const Chatref = collection(db, 'userchats')
    const Userchatef = collection(db, 'Chats')
    const newChatref = doc(Chatref)

    // Create a new chat document
    await setDoc(newChatref, {
      createdAt: serverTimestamp(),
      messages: [],
    })

    // Update the user's chat document with the new chat reference
    await updateDoc(doc(Userchatef, UserID), {
      Chats: arrayUnion({
        chatID: newChatref.id,
        LastMessage: '',
        receiverId: UserID,
        UpdatedAt: new Date().toLocaleString(),
      }),
    })

    // Send a successful response with the new chat ID
    res
      .status(200)
      .json({ chatID: newChatref.id, message: 'Chat created successfully' })
    console.log('Chat created:', newChatref.id)
  } catch (error) {
    console.error('Error creating chat:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default ChatRouter
