import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../FirebaseConfig.js'
export const GetChat = async (ChatID) => {
  try {
    if (!ChatID) {
      console.log('ChatID is required')
    }
    // Get a reference to the document
    const chatDocRef = doc(db, 'userchats', ChatID)
    // Fetch the document
    const chatDocSnap = await getDoc(chatDocRef)
    if (chatDocSnap.exists()) {
      // Document exists, send it back
      return chatDocSnap.data()
    } else {
      // Document does not exist
      console.log('Chat not found')
    }
  } catch (error) {
    console.error('Error fetching chat data:', error)
  }
}
