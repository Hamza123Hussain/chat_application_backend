import express from 'express'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../FirebaseConfig.js'

const MessagesRouter = express.Router()

MessagesRouter.post('/', async (req, res) => {
  try {
    const { text, senderid, chatID } = req.body

    // Define the document reference
    const chatRef = doc(db, 'userchats', chatID)

    // Update the document by pushing a new message to the messages array
    await updateDoc(chatRef, {
      messages: arrayUnion({
        senderid,
        text,
        timestamp: new Date(), // Example field; adjust as needed
      }),
    })

    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: 'Message added successfully' })
  } catch (error) {
    // Handle errors and respond with error message
    console.error('Error adding message:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message,
    })
  }
})

export default MessagesRouter
