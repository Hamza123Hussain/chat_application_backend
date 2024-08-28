import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../FirebaseConfig.js'
export const GetChat = async (req, res) => {
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
}
