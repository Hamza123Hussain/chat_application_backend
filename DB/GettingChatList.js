import { db } from '../FirebaseConfig.js'
import { collection, doc, getDoc } from 'firebase/firestore'
export const GetChats = async (req, res) => {
  const { userId } = req.body
  try {
    console.log(`Fetching chats for user ID: ${userId}`)

    // Reference to the user's chat document in the 'Chats' collection
    const chatDocRef = doc(collection(db, 'Chats'), userId)
    const chatDocSnap = await getDoc(chatDocRef)

    if (chatDocSnap.exists()) {
      // Retrieve chat data
      const chatItems = chatDocSnap.data()

      // Fetch user data for each chat item
      const chatData = await Promise.all(
        chatItems.map(async (chat) => {
          try {
            const userDocRef = doc(collection(db, 'Users'), chat.receiverId)
            const userDocSnap = await getDoc(userDocRef)

            // Attach user data to chat item if user exists
            if (userDocSnap.exists()) {
              return { ...chat, user: userDocSnap.data() }
            } else {
              console.error(`User with ID ${chat.receiverId} not found.`)
              return { ...chat, user: null }
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
            return { ...chat, user: null }
          }
        })
      )

      // Send the chat data as response
      res.json({ chatData })
    } else {
      console.log(`No chat document found for user ID: ${userId}`)
      res.status(404).json({ message: 'No chat document found for this user.' })
    }
  } catch (error) {
    console.error('Error fetching user chats:', error)
    res.status(500).json({ message: 'Error fetching user chats.', error })
  }
}
