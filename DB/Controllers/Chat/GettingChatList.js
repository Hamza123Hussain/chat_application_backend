import { db } from '../../../FirebaseConfig.js'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'

export const GetChats = (req, res, io) => {
  const { userId } = req.query

  try {
    console.log(`Fetching chats for user ID: ${userId}`)
    // Reference to the user's chat document in the 'Chats' collection
    const chatDocRef = doc(collection(db, 'Chats'), userId)

    // Set up a real-time listener for chat updates
    const unsubscribe = onSnapshot(chatDocRef, async (chatDocSnap) => {
      if (chatDocSnap.exists()) {
        // Retrieve chat data
        const chatItems = chatDocSnap.data().chats || []

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
        // Emit updated chat data to clients
        io.emit('chatUpdate', { chatData })
      } else {
        console.log(`No chat document found for user ID: ${userId}`)
        io.emit('chatUpdate', { chatData: [] }) // Emit empty chat list if no document found
      }
    })

    // Return a successful response with initial data (optional)
    res.status(200).json({ message: 'Listening for chat updates', userId })

    // Optionally return a way to stop listening (not necessary for basic setup)
    return () => unsubscribe()
  } catch (error) {
    console.error('Error fetching user chats:', error)
    res.status(500).json({ message: 'Error fetching user chats.', error })
  }
}
