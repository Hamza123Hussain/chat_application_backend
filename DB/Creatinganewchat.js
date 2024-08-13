import express from 'express'
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../FirebaseConfig.js'

const ChatRouter = express.Router()

ChatRouter.post('/', async (req, res) => {
  try {
    const { ChatID, CurrentChatID } = req.body

    // Check if ChatID is provided in the request body
    if (!ChatID) {
      return res.status(400).json({ error: 'ChatID is required' })
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
    await updateDoc(doc(Userchatef, ChatID), {
      Chats: arrayUnion({
        chatID: newChatref.id,
        LastMessage: '',
        receiverId: CurrentChatID,
        UpdatedAt: new Date().toLocaleString(),
      }),
    })

    await updateDoc(doc(Userchatef, CurrentChatID), {
      Chats: arrayUnion({
        chatID: newChatref.id,
        LastMessage: '',
        receiverId: ChatID,
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

ChatRouter.get('/Chat', async (req, res) => {
  try {
    const ChatID = req.query.ChatID
    if (!ChatID) {
      return res.status(400).json({ error: 'ChatID is required' })
    }

    // Get a reference to the document
    const chatDocRef = doc(db, 'userchats', ChatID)

    // Fetch the document
    const chatDocSnap = await getDoc(chatDocRef)

    if (chatDocSnap.exists()) {
      // Document exists, send it back
      res.status(200).json(chatDocSnap.data())
    } else {
      // Document does not exist
      res.status(404).json({ error: 'Chat not found' })
    }
  } catch (error) {
    console.error('Error fetching chat data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default ChatRouter
