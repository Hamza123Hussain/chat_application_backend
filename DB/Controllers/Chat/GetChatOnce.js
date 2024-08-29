import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../FirebaseConfig.js'
export const GetChatOnce = async (req, res) => {
  const { ChatID } = req.query
  try {
    if (!ChatID) {
      console.log('ChatID is required')
    }
    const chatDocRef = doc(db, 'userchats', ChatID)
    const chatDocSnap = await getDoc(chatDocRef)
    if (chatDocSnap.exists()) {
      return res.status(200).json(chatDocSnap.data())
    } else {
      console.log('Chat not found')
      res.status(404).json('NO Char')
    }
  } catch (error) {
    console.error('Error fetching chat data:', error)
    res.status(500).json(`Internal server Error : ${error} `)
  }
}
