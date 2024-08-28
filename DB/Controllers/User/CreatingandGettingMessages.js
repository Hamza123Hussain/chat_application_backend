import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../FirebaseConfig.js'

export const CreateMssage = async (req, res) => {
  try {
    const { chatID, text, senderId, receiverId } = req.body

    // Validate required fields
    if (!chatID || !text || !senderId || !receiverId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Reference to the chat document
    const chatDocumentRef = doc(db, 'userchats', chatID)

    // Update the document by pushing the new message to the messages array
    await updateDoc(chatDocumentRef, {
      messages: arrayUnion({
        senderId,
        text,
        timestamp: new Date(), // Add a timestamp for the message
      }),
    })

    // References to the sender and receiver documents in the 'Chats' collection
    const senderDocumentRef = doc(db, 'Chats', senderId)
    const receiverDocumentRef = doc(db, 'Chats', receiverId)

    // Perform updates for sender and receiver documents
    await Promise.all([
      updateDoc(senderDocumentRef, {
        LastMessage: text,
        UpdatedAt: new Date(), // Update the timestamp
      }),
      updateDoc(receiverDocumentRef, {
        LastMessage: text,
        UpdatedAt: new Date(), // Update the timestamp
      }),
    ])

    // Get updated data from the chat document
    const chatData = true

    return res.status(200).json(chatData)
  } catch (error) {
    console.error('Error creating message:', error)
    return res
      .status(500)
      .json({ error: 'Internal server error', details: error.message })
  }
}
