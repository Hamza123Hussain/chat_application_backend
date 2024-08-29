import { arrayUnion, doc, updateDoc, getDoc } from 'firebase/firestore'
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
    // Get the current chat data for both sender and receiver
    const [senderDocSnap, receiverDocSnap] = await Promise.all([
      getDoc(senderDocumentRef),
      getDoc(receiverDocumentRef),
    ])
    if (!senderDocSnap.exists() || !receiverDocSnap.exists()) {
      return res.status(404).json({ error: 'Chat data not found' })
    }
    const senderChats = senderDocSnap.data().chats || []
    const receiverChats = receiverDocSnap.data().chats || []
    // Function to update the chat array with the latest message
    const updateChatArray = (chats, chatID, lastMessage) => {
      return chats.map((chat) =>
        chat.chatID === chatID
          ? {
              ...chat,
              LastMessage: lastMessage,
              UpdatedAt: new Date().toLocaleString(),
            }
          : chat
      )
    }
    // Update the chats for sender and receiver
    await Promise.all([
      updateDoc(senderDocumentRef, {
        chats: updateChatArray(senderChats, chatID, text),
      }),
      updateDoc(receiverDocumentRef, {
        chats: updateChatArray(receiverChats, chatID, text),
      }),
    ])
    // Send a successful response
    res.status(200).json({ senderId, text, timestamp: new Date() })
    console.log('Message created and chats updated successfully')
  } catch (error) {
    console.error('Error creating message:', error)
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message })
  }
}
